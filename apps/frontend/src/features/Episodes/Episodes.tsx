import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useEpisodesStore } from '@/stores/episodesStore';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/episodes/page',
  });

  const { episodesNavaigationState, setEpisodesNavaigationState } = useEpisodesStore();

  // マウント時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // 少し遅延させて復元（レンダリングが完了してから）
    const timer = setTimeout(() => {
      element.scrollTop = episodesNavaigationState.scrollPosition;
    }, 50);

    // クリーンアップ関数
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 画面遷移直前の処理
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setEpisodesNavaigationState({ currentPagePath: router.asPath });

      const element = scrollRef?.current;
      if (!element) {
        return;
      }

      const scrollPosition = element.scrollTop ?? 0;
      setEpisodesNavaigationState({ scrollPosition });
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
