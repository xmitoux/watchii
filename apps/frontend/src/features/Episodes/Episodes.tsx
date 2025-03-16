import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  console.log('📖 エピソードレンダリング');

  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/episodes/page',
  });

  const navigationStore = useNavigationStore(
    'episodes', (state) => ({
      scrollPosition: state.scrollPosition,
      setCurrentPagePath: state.setCurrentPagePath,
      setScrollPosition: state.setScrollPosition,
    }),
  );

  // マウント時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    console.log('エピソードuseEffect1️⃣');

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
      console.log('🛣️ エピソードから遷移します');

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

  const imageWidth = usePostImageWidth();

  function handleImageClick(episodeId: number) {
    router.push(`/episodes/ep/${episodeId}`);
  }

  return (
    <Layout title="エピソード一覧" scrollRef={scrollRef}>
      {/* エピソード一覧 */}
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {episodes?.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            imageWidth={imageWidth}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

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
