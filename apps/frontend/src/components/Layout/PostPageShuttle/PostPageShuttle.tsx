// Postページシャトル
import React, { RefObject } from 'react';

import { ActionBar, Box, Flex } from '@repo/ui/chakra-ui';

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
  const {
    handleScrollTop,
    handlePrevImage,
    handleNextImage,
    handleScrollBottom,
    currentImageIndex,
  } = usePostPageShuttleScroll({ postsPerPage, scrollRef });

  return (
    <ActionBar.Root open={true}>
      <ActionBar.Positioner position="fixed" bottom="90px">
        <ActionBar.Content padding={0}>
          <Flex align="center" justify="space-between" px={4} width="300px" height="48px">
            <Flex gap={4}>
              <PostPageShuttleButton direction="top" onClick={handleScrollTop} />
              <PostPageShuttleButton direction="up" onClick={handlePrevImage} />
            </Flex>

            <Box>
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
