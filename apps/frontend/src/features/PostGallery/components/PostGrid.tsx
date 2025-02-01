// post一覧グリッド
import { Center, Flex } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';
import { SimplePost } from '@repo/ui/types';

import { DisplayMode } from '@/components/Drawer/DisplaySettingsDrawer';

type PostGridProps = {
  posts: SimplePost[];
  displayMode: DisplayMode;
  onImageClick: (filename: string) => void;
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
            src={post.filename}
            width={800}
            styleWidth={imageWidth}
            alt={post.filename}
            priority
            onClick={() => onImageClick(post.filename)}
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
