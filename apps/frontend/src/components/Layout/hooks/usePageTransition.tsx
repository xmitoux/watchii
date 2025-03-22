import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type Variants from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type TransitionDirection = -1 | 0 | 1;

/**
 * ページトランジション効果を管理するカスタムフック
 * ページネーションではスライド効果、それ以外ではフェード効果を適用
 */
export function usePageTransition() {
  const router = useRouter();
  const [direction, setDirection] = useState<TransitionDirection>(0);

  // URLからページ番号を取得
  const getPageNumberFromPath = (path: string): number => {
    const match = path.match(/\/page\/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // パスのベース部分を取得（/home/page/1 -> /home）
  const getPathBase = (path: string): string => {
    return path.split('/page/')[0];
  };

  // ページ遷移を監視してトランジション方向を決定
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // 現在と次のパスのベース部分を取得
      const currentPathBase = getPathBase(router.asPath);
      const nextPathBase = getPathBase(url);

      // 同じセクション内でのページ移動かチェック
      if (currentPathBase === nextPathBase && url.includes('/page/')) {
        const currentPageNum = getPageNumberFromPath(router.asPath);
        const nextPageNum = getPageNumberFromPath(url);

        // ページ番号を比較して方向を決定
        if (nextPageNum > currentPageNum) {
          setDirection(1); // 次へ：右から左
        }
        else if (nextPageNum < currentPageNum) {
          setDirection(-1); // 前へ：左から右
        }
        else {
          setDirection(0); // 同じページならフェード
        }
      }
      else {
        // 異なるセクション間の移動はフェード
        setDirection(0);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // アニメーションのバリアント定義
  const variants: Variants.Variants = {
    // 方向によって異なる初期状態
    initial: (direction: TransitionDirection) => {
      // ページネーションの場合はスライド
      if (direction !== 0) {
        return {
          x: direction > 0 ? '100%' : '-100%',
          opacity: 0,
        };
      }
      // 通常の画面遷移はフェード
      return {
        opacity: 0,
      };
    },
    // アニメーション中の状態
    animate: {
      x: 0,
      opacity: 1,
    },
    // 退場時の状態
    exit: (direction: TransitionDirection) => {
      // ページネーションの場合はスライド
      if (direction !== 0) {
        return {
          x: direction < 0 ? '100%' : '-100%',
          opacity: 0,
        };
      }
      // 通常の画面遷移はフェード
      return {
        opacity: 0,
      };
    },
  };

  // TypeScriptエラーを修正するため、適切な型でオブジェクトを分割
  const transitionProps: HTMLMotionProps<'div'> = {
    custom: direction,
    variants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    transition: (direction !== 0)
      ? {
        // スライド時のトランジション設定
        x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
        opacity: { duration: 0.2 }, // スライド時は素早くフェード
      }
      : {
        // フェードのみの時のトランジション設定
        opacity: { duration: 0.8 }, // フェードのみの時はゆっくり (0.8秒に設定)
      },
    style: {
      width: '100%',
      position: 'relative' as const,
    },
  };

  return { transitionProps, direction };
}
