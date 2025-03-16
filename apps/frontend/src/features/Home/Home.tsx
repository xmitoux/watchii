import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/features/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useHomeStore } from '@/stores/homeStore';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/home/page',
    scrollRef,
  });

  const { homeNavaigationState, setHomeNavaigationState } = useHomeStore();

  // マウント時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // 少し遅延させて復元（レンダリングが完了してから）
    const timer = setTimeout(() => {
      element.scrollTop = homeNavaigationState.scrollPosition;
    }, 50);

    // クリーンアップ関数
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 画面遷移直前の処理
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setHomeNavaigationState({ currentPagePath: router.asPath });

      const element = scrollRef?.current;
      if (!element) {
        return;
      }

      const scrollPosition = element.scrollTop ?? 0;
      setHomeNavaigationState({ scrollPosition });
    };

    // イベントリスナーを登録
    router.events.on('routeChangeStart', handleRouteChangeStart);

    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <Layout title="Watchii" scrollRef={scrollRef}>
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={4}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={pagination}
        />
      </Center>
    </Layout>
  );
}
