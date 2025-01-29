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
  postedAt: string;
}

async function uploadImages(
  url: string,
  { arg }: { arg: { files: File[]; postedAtList: string[] } },
) {
  const formData = new FormData();
  for (const file of arg.files) {
    formData.append('files', file);
  }
  for (const postedAt of arg.postedAtList) {
    formData.append('postedAtList[]', postedAt);
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
      const newImages: ImageData[] = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        postedAt: new Date().toISOString(),
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleDateChange = (index: number, date: string) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index].postedAt = new Date(date).toISOString();
      return newImages;
    });
  };

  const handleSubmit = async () => {
    try {
      const request = {
        files: images.map(img => img.file),
        postedAtList: images.map(img => img.postedAt),
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
                <span>投稿日時</span>
                <Input
                  type="datetime-local"
                  value={new Date(image.postedAt).toISOString().slice(0, 16)}
                  onChange={e => handleDateChange(index, e.target.value)}
                />
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
