import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/episodes/page',
    scrollRef,
  });

  useNavigationRestore('episodes', scrollRef);

  const imageWidth = usePostImageWidth();

  const resetEpisodeDetailStore = useNavigationStore('episodeDetail', (state) => state.reset);

  useEffect(() => {
    // エピソード詳細ページのストアをリセット
    // (一覧ページを開いた時点で詳細の復元状態は不要)
    resetEpisodeDetailStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
