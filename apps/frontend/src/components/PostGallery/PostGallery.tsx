// post一覧コンポーネント

import Link from 'next/link';

import { Flex, Text } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { formatToJST } from '@repo/ui/utils';

import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { PostEntity } from '@/types/post-types';

type PostGalleryProps = {
  posts: PostEntity[];
};

export const PostGallery = ({ posts }: PostGalleryProps) => {
  const imageWidth = usePostImageWidth();

  return (
    <Flex direction="column" align="center" gap={4}>
      {posts.map((post, index) => (
        <Flex
          key={post.id}
          direction="column"
          align="end"
          gap={1}
          // ページシャトルによるスクロール操作用の属性
          data-image-index={index}
        >
          <Link href={`/posts/${post.id}`}>
            <NextImage
              src={post.filename}
              width={700}
              styleWidth={imageWidth}
              alt={post.filename}
              priority
            />

            <Text fontSize="xs" color="gray">
              投稿:
              {' '}
              {formatToJST(post.postedAt)}
            </Text>
          </Link>
        </Flex>
      ))}
    </Flex>
  );
};
