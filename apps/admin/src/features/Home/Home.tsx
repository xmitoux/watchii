import axios from 'axios';
import { useRef, useState } from 'react';
import { MdAddPhotoAlternate, MdClose } from 'react-icons/md';
import useSWRMutation from 'swr/mutation';

import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { useDeviceType } from '@repo/ui/hooks';

import Layout from '@/components/Layout/Layout';

// ファイル名バリデーション用正規表現
const regex = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})-.*\..+$/;

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
  const { trigger, isMutating } = useSWRMutation('/api/posts/create', uploadImages);

  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '200px';

  const [images, setImages] = useState<ImageData[]>([]);
  const isImageSelected = images.length > 0;

  // ドラッグ状態管理(スタイル変更用)
  const [isDragging, setIsDragging] = useState(false);
  // ファイルインプット操作用ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** ファイル選択処理(ファイル変更・ドロップ時) */
  function selectFiles(files: File[]) {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    // ファイル名バリデーション
    files.forEach((file) => {
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
        title: `ファイル名が不正な画像が選択されました🤔(${file.name})`,
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

  /** ファイル変更イベントハンドラ */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      selectFiles([...files]);
    }
  }

  /** ファイルドロップイベントハンドラ */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      selectFiles([...files]);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragIn(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragOut(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  /** ファイル削除処理 */
  function handleRemoveImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  }

  /** Post登録処理 */
  async function handleSubmit() {
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
  }
  return (
    <Layout title="Watchii Admin">
      {/* ファイル入力エリア */}
      <Box
        bg={isDragging ? 'blue.400' : 'gray.500'}
        border={isImageSelected ? 'solid' : 'dashed'}
        borderWidth="2px"
        borderColor={isDragging ? 'blue.300' : 'gray.200'}
        borderRadius="md"
        minH="30vh"
        maxH="70vh"
        overflow="auto"
        p={3}
        mb={5}
        transition="all 0.2s"
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isImageSelected ? (
          // プレビュー表示
          <Flex
            justify="center"
            gap={4}
            wrap="wrap"
            // ドラッグ時の色変更が消えないよう子要素のイベントを無効化
            pointerEvents="none"
          >
            {images.map((image, index) => (
              <Box key={index} position="relative">
                <Image
                  src={image.preview}
                  w={imageWidth}
                  alt={`Preview ${index}`}
                  borderRadius="sm"
                />

                {/* 削除ボタン */}
                <IconButton
                  rounded="full"
                  colorPalette="red"
                  size="2xs"
                  position="absolute"
                  top={1}
                  right={1}
                  transition="transform 0.2s"
                  _hover={{
                    transform: 'scale(1.2)',
                  }}
                  // 削除ボタンだけイベント有効
                  pointerEvents="auto"
                  onClick={(e) => {
                    e.stopPropagation(); // 親要素のクリックイベントを止める
                    handleRemoveImage(index);
                  }}
                >
                  <MdClose />
                </IconButton>
              </Box>
            ))}
          </Flex>
        ) : (
          // ファイル未選択時の表示
          <VStack pointerEvents="none">
            <HStack>
              <Icon size="lg">
                <MdAddPhotoAlternate />
              </Icon>
              <Text fontSize="lg">ここに画像をドラッグ＆ドロップ</Text>
            </HStack>
            <Text fontSize="sm">または クリックしてファイルを選択</Text>
          </VStack>
        )}

        {/* ファイル入力用の隠し要素 */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </Box>

      <Center>
        <Button
          disabled={!isImageSelected}
          loading={isMutating}
          w="sm"
          onClick={handleSubmit}
        >
          登録する
        </Button>
      </Center>

      {/* トースト用 */}
      <Toaster />
    </Layout>
  );
}
