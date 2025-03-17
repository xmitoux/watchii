import { useRouter } from 'next/router';
import { RefObject, useEffect } from 'react';

import { NavigationStoreKey, useNavigationStore } from '@/stores/navigationStore';

export const useNavigationRestore = (storeKey: NavigationStoreKey, scrollRef: RefObject<HTMLDivElement | null>) => {
  const router = useRouter();

  const navigationStore = useNavigationStore(
    storeKey, (state) => ({
      scrollPosition: state.scrollPosition,
      setCurrentPagePath: state.setCurrentPagePath,
      setScrollPosition: state.setScrollPosition,
    }),
  );

  // マウント時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // 少し遅延させて復元（レンダリングが完了してから）
    const timer = setTimeout(() => {
      element.scrollTop = navigationStore.scrollPosition;
    }, 50);

    // クリーンアップ関数
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 画面遷移直前の処理
  useEffect(() => {
    const handleRouteChangeStart = () => {
      navigationStore.setCurrentPagePath(router.asPath);

      const element = scrollRef?.current;
      if (!element) {
        return;
      }

      const scrollPosition = element.scrollTop ?? 0;
      navigationStore.setScrollPosition(scrollPosition);
    };

    // イベントリスナーを登録
    router.events.on('routeChangeStart', handleRouteChangeStart);

    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
};
