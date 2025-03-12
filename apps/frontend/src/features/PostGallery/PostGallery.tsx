// post一覧コンポーネント

import { Box, Flex } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { SimplePost } from '@repo/ui/types';

import { usePostImageWidth } from '@/hooks/usePostImageWidth';

type PostGalleryProps = {
  posts: SimplePost[];
};

export const PostGallery = ({ posts }: PostGalleryProps) => {
  const imageWidth = usePostImageWidth();

  return (
    <>
      <Flex justify="center" gap={4} flexWrap="wrap">
        {posts.map(post => (
          <Box key={post.id}>
            <NextImage
              src={post.filename}
              width={400}
              styleWidth={imageWidth}
              alt={post.filename}
              priority
            />
          </Box>
        ))}
      </Flex>
    </>
  );
};
