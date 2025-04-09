import Link from 'next/link';

import { Flex, Text } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { PostEntity } from '@repo/ui/types';
import { formatToJST } from '@repo/ui/utils';

import { usePostImageWidth } from '@/hooks/usePostImageWidth';

type PostGalleryProps = {
  posts: PostEntity[];
};

/** Post一覧コンポーネント */
export function PostGallery({ posts }: PostGalleryProps) {
  const imageWidth = usePostImageWidth();

  return (
    <Flex direction="column" align="center" gap={4}>
      {posts.map((post) => (
        <Flex
          key={post.id}
          direction="column"
          align="end"
          gap={1}
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
}
