import axios from 'axios';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

import {
  Box,
  Container,
  Grid,
  Image,
  Input,
  VStack,
} from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';

import Layout from '@/components/Layout/Layout';

interface ImageData {
  file: File;
  preview: string;
}

async function uploadImages(
  url: string,
  { arg }: { arg: { files: File[] } },
) {
  const formData = new FormData();
  for (const file of arg.files) {
    formData.append('files', file);
  }

  await axios.post(
    url,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);

  const { trigger, isMutating } = useSWRMutation('/api/posts/create', uploadImages);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = [...e.target.files];
      const validFiles: File[] = [];
      const invalidFiles: File[] = [];

      // ファイル名バリデーション
      const regex = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})-.*\..+$/;
      newFiles.forEach((file) => {
        if (regex.test(file.name)) {
          validFiles.push(file);
        }
        else {
          invalidFiles.push(file);
        }
      });

      const newImages: ImageData[] = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...newImages]);

      invalidFiles.forEach((file) => {
        // トースト表示制御用ID
        const id = 'toast' + file.name;

        toaster.create({
          id,
          title: `ファイル名が不正な画像が選択されました！(${file.name})`,
          type: 'error',
          action: {
            label: 'OK',
            onClick: () => (console.warn(file.name)),
          },
        });

        // トーストを表示し続ける
        toaster.pause(id);
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const request = {
        files: images.map(img => img.file),
      };

      await trigger(request);

      toaster.create({
        title: 'アップロード完了',
        type: 'success',
      });

      setImages([]);
    }
    catch {
      toaster.create({
        title: 'エラーが発生しました',
        type: 'error',
      });
    }
  };

  return (
    <Layout title="Watchii Admin">
      <Container maxW="container.md" py={8}>
        <VStack spaceX={6}>
          <span>画像を選択</span>
          <Input
            accept="image/*"
            multiple
            type="file"
            onChange={handleFileChange}
          />

          <Grid gap={4} templateColumns="repeat(2, 1fr)">
            {images.map((image, index) => (
              <Box key={index} borderRadius="md" borderWidth={1} p={4}>
                <Image alt={`Preview ${index}`} src={image.preview} />
              </Box>
            ))}
          </Grid>

          <Button
            colorScheme="blue"
            disabled={images.length === 0}
            loading={isMutating}
            onClick={handleSubmit}
          >
            投稿する
          </Button>
        </VStack>
      </Container>

      <Toaster />
    </Layout>
  );
}
