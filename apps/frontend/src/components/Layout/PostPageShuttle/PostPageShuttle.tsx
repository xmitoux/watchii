// Postページシャトル
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { ActionBar, Box, Flex } from '@repo/ui/chakra-ui';

import { PostPageShuttleButton } from './PostPageShuttleButton';

// 最も表示されている画像を特定する関数
function getMostVisibleImageIndex(container: HTMLElement): number | null {
  const images = container.querySelectorAll('[data-image-index]');
  const containerHeight = container.clientHeight;
  let bestMatchIndex = null;
  let minOffset = Infinity;

  images.forEach((image) => {
    const elementTop = (image as HTMLElement).offsetTop;
    const elementHeight = (image as HTMLElement).offsetHeight;

    // scrollImageToCenterと同じ計算方法で理想的な位置を算出
    const idealPosition = elementTop - (containerHeight - elementHeight) / 2;

    // 現在のスクロール位置
    const currentScroll = container.scrollTop;

    // 理想位置との差分を計算
    const offset = Math.abs(currentScroll - idealPosition);

    // より理想位置に近い画像を選択
    if (offset < minOffset) {
      minOffset = offset;
      bestMatchIndex = Number(image.getAttribute('data-image-index'));
    }
  });

  return bestMatchIndex;
}

type PostPageShuttleProps = {
  scrollRef?: RefObject<HTMLDivElement | null>;
  totalPosts: number;
};

export default function PostPageShuttle({ scrollRef, totalPosts = 0 }: PostPageShuttleProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 画像を中央に表示する共通処理
  const scrollImageToCenter = useCallback((index: number) => {
    if (!scrollRef?.current) {
      return;
    }

    const imageElement = scrollRef.current.querySelector(`div[data-image-index="${index}"]`) as HTMLElement | null;
    if (!imageElement) {
      return;
    }

    const containerHeight = scrollRef.current.clientHeight;
    const elementTop = imageElement.offsetTop;
    const elementHeight = imageElement.offsetHeight;
    // 画像の中央にスクロールする(小さいスマホでPostがシャトルに隠れ内容少し上にずらす)
    const scrollTo = elementTop - (containerHeight - elementHeight) / 2 + 40;

    scrollRef.current.scrollTo({
      top: scrollTo,
      behavior: 'smooth',
    });
  }, [scrollRef]);

  // 手動スクロール状態の制御
  const setManualScrolling = useCallback((duration: number = 1000) => {
    isManualScrolling.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, duration);
  }, []);

  const handleScrollTop = useCallback(() => {
    if (!scrollRef?.current) {
      return;
    }

    setManualScrolling(1500);
    setCurrentImageIndex(0); // 最初の画像に設定
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scrollRef, setManualScrolling]);

  const handleScrollBottom = useCallback(() => {
    if (!scrollRef?.current) {
      return;
    }

    setManualScrolling(1500);
    setCurrentImageIndex(totalPosts - 1); // 最後の画像に設定
    const { scrollHeight } = scrollRef.current;
    scrollRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
  }, [scrollRef, setManualScrolling, totalPosts]);

  const handlePrevImage = useCallback(() => {
    if (!scrollRef?.current || currentImageIndex <= 0) {
      return;
    }

    const newIndex = currentImageIndex - 1;
    setManualScrolling(1500); // スクロールとアニメーション完了までの時間を考慮
    setCurrentImageIndex(newIndex);
    scrollImageToCenter(newIndex);
  }, [currentImageIndex, scrollRef, setManualScrolling, scrollImageToCenter]);

  const handleNextImage = useCallback(() => {
    if (!scrollRef?.current || currentImageIndex >= totalPosts - 1) {
      return;
    }

    const newIndex = currentImageIndex + 1;
    setManualScrolling(1500); // スクロールとアニメーション完了までの時間を考慮
    setCurrentImageIndex(newIndex);
    scrollImageToCenter(newIndex);
  }, [currentImageIndex, totalPosts, scrollRef, setManualScrolling, scrollImageToCenter]);

  // スクロール検知による現在の画像インデックスの更新
  useEffect(() => {
    const container = scrollRef?.current;
    if (!container) {
      return;
    }

    let scrollEndTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      if (isManualScrolling.current) {
        return;
      }

      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }

      // スクロール終了後に最も表示されている画像を検出
      scrollEndTimeout = setTimeout(() => {
        const mostVisibleIndex = getMostVisibleImageIndex(container);
        if (mostVisibleIndex !== null) {
          setCurrentImageIndex(mostVisibleIndex);
        }
      }, 10); // スクロール終了後200msでインデックスを更新
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
    };
  }, [scrollRef]);

  return (
    <ActionBar.Root open={true}>
      <ActionBar.Positioner position="fixed" bottom="24">
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
