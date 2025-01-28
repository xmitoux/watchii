// post一覧グリッド
import NextImage from 'next/image';

import { Center, Flex } from '@repo/ui/chakra-ui';

import { DisplayMode } from '@/components/Drawer/DisplaySettingsDrawer';
import { useDeviceType } from '@/hooks/useDeviceType';
import { SimplePost } from '@/types/post';

type PostGridProps = {
  posts: SimplePost[];
  displayMode: DisplayMode;
  onImageClick: (imageUrl: string) => void;
  isLoadingMore?: boolean;
  observerRef?: (node: HTMLDivElement | null) => (() => void) | undefined;
  hasMore?: boolean;
};

export function PostGrid({
  posts,
  displayMode,
  onImageClick,
  isLoadingMore,
  observerRef,
  hasMore,
}: PostGridProps) {
  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();

  const imageWidth = isMobile
    ? (displayMode === 'one-column' ? '90vw' : '40vw')
    : '300px';

  return (
    <>
      <Flex justify="center" gap={4} flexWrap="wrap">
        {posts.map(post => (
          <NextImage
            key={post.id}
            style={{ width: imageWidth, height: 'auto' }}
            src={post.imageUrl}
            width={800}
            height={0}
            alt={post.imageUrl}
            priority
            onClick={() => onImageClick(post.imageUrl)}
          />
        ))}
      </Flex>

      {/* 無限スクロールローディング */}
      {isLoadingMore && <Center p={4}>読み込み中...🔄</Center>}

      {/* 無限スクロール監視対象要素 */}
      {hasMore && <div ref={observerRef} style={{ height: '10px' }} />}
    </>
  );
}
