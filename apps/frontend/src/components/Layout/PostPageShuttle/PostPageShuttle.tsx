// Postページシャトル
import React, { RefObject } from 'react';

import { ActionBar, Box, Flex } from '@repo/ui/chakra-ui';

import { usePostPageShuttleScroll } from './hooks/usePostPageShuttleScroll';
import { PostPageShuttleButton } from './PostPageShuttleButton';

export type PostPageShuttleProps = {
  scrollRef?: RefObject<HTMLDivElement | null>;
  totalPosts: number;
};

export default function PostPageShuttle({ totalPosts, scrollRef }: PostPageShuttleProps) {
  const {
    handleScrollTop,
    handlePrevImage,
    handleNextImage,
    handleScrollBottom,
    currentImageIndex,
  } = usePostPageShuttleScroll({ totalPosts, scrollRef });

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
              {currentImageIndex + 1}
              {' '}
              /
              {' '}
              {totalPosts}
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
