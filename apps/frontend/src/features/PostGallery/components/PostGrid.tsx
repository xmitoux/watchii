// post一覧グリッド
import { Flex } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';
import { SimplePost } from '@repo/ui/types';

type PostGridProps = {
  posts: SimplePost[];
  isLoadingMore?: boolean;
  observerRef?: (node: HTMLDivElement | null) => (() => void) | undefined;
  hasMore?: boolean;
};

export function PostGrid({
  posts,
  observerRef,
  hasMore,
}: PostGridProps) {
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

      {/* 無限スクロール監視対象要素 */}
      {hasMore && <div ref={observerRef} style={{ height: '10px' }} />}
    </>
  );
}
