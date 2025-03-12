// post一覧コンポーネント

import { Flex } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';
import { SimplePost } from '@repo/ui/types';

type PostGalleryProps = {
  posts: SimplePost[];
};

export const PostGallery = ({ posts }: PostGalleryProps) => {
  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '90vw' : 'auto';
  const imageHeight = isMobile ? 'auto' : '80vh';

  return (
    <>
      <Flex justify="center" gap={4} flexWrap="wrap">
        {posts.map(post => (
          <NextImage
            key={post.id}
            src={post.filename}
            width={400}
            styleWidth={imageWidth}
            styleHeight={imageHeight}
            alt={post.filename}
            priority
          />
        ))}
      </Flex>
    </>
  );
};
