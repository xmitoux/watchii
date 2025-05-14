// Postページシャトル
import React, { RefObject, useEffect } from 'react';

import { ActionBar, Box, Flex } from '@repo/ui/chakra-ui';

import { useDeviceTypeStore } from '@/stores/deviceTypeStore';

import { usePostPageShuttleScroll } from './hooks/usePostPageShuttleScroll';
import { PostPageShuttleButton } from './PostPageShuttleButton';

export type PostPageShuttleProps = {
  scrollRef?: RefObject<HTMLDivElement | null>;
  /** 1ページ(ページネーション単位)あたりのPost枚数 */
  postsPerPage: number;
  /** 総Post(ページネーション全体)枚数 */
  postsTotal?: number;
  /** Postページ用のオフセット値 */
  pageOffset?: number;
};

export default function PostPageShuttle({ postsPerPage, scrollRef, pageOffset, postsTotal }: PostPageShuttleProps) {
  const { isPWA } = useDeviceTypeStore();

  const {
    handleScrollTop,
    handlePrevImage,
    handleNextImage,
    handleScrollBottom,
    currentImageIndex,
    // setCurrentImageIndex,
  } = usePostPageShuttleScroll({ postsPerPage, scrollRef });

  useEffect(() => {
    // オフセット値が変更(=ページ移動)されたらインデックスをリセット
    // (ページ移動時、インデックスが正しく更新されず現在ページ番号が実際と異なることがあるのでその対応)
    // (スライドトランジションを入れたら不要になったのでコメントアウト)
    // setCurrentImageIndex(0);

  }, [pageOffset]);

  return (
    <ActionBar.Root open={true}>
      <ActionBar.Positioner position="fixed" bottom={isPWA ? '90px' : '75px'} zIndex={1000}>
        <ActionBar.Content bg={{ base: 'gray.50', _dark: 'blackPrimary' }} padding={0}>
          <Flex align="center" justify="space-between" px={4} width="300px" height="48px">
            <Flex gap={4}>
              <PostPageShuttleButton direction="top" onClick={handleScrollTop} />
              <PostPageShuttleButton direction="up" onClick={handlePrevImage} />
            </Flex>

            <Box color="blackSwitch" fontSize="sm">
              {currentImageIndex + 1 + (pageOffset || 0)}
              {' / '}
              {postsTotal || postsPerPage}
            </Box>

            <Flex gap={4}>
              <PostPageShuttleButton direction="down" onClick={handleNextImage} />
              <PostPageShuttleButton direction="bottom" onClick={handleScrollBottom} />
            </Flex>
          </Flex>
        </ActionBar.Content>
      </ActionBar.Positioner>
    </ActionBar.Root>
  );
}
