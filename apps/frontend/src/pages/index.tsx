import NextImage from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';

import { Flex } from '@repo/ui/chakra-ui';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';

import Layout from '@/components/Layout/Layout';

type PostsFindResponse = {
  id: number;
  imageUrl: string;
}[];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: posts, error, isLoading } = useSWR<PostsFindResponse>('/api/posts', fetcher);

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Layout title="Watchii">
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >

        {posts?.map(post => (
          <NextImage
            key={post.id}
            style={{ width: '300px', height: 'auto' }}
            src={post.imageUrl}
            alt={`post id: ${post.id.toString()}`}
            width={600}
            height={0}
            priority
            onClick={() => handleImageClick(post.imageUrl)}
          />
        ))}
      </Flex>

      {/* 拡大表示ダイアログ */}
      <DialogRoot
        open={isImageDialogOpen}
        placement="center"
        onOpenChange={e => setIsImageDialogOpen(e.open)}
      >
        <DialogContent background="transparent" boxShadow="none">
          <DialogBody>
            <NextImage
              style={{ width: '500px', height: 'auto' }}
              src={selectedImage}
              alt="拡大画像"
              width={1000}
              height={0}
              priority
              onClick={() => setIsImageDialogOpen(false)}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Layout>
  );
}
