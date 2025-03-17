import { useRouter } from 'next/router';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useEpisodeDetailStore } from '@/stores/episodeDetailStore';

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

  const setParentPagePath = useEpisodeDetailStore((state) => state.setParentPagePath);

  function handleImageClick(episodeId: number) {
    // エピソード詳細画面に遷移する際に、親ページのパスを保存する
    // (ホーム画面からエピソード詳細を復元した際、元のエピソード一覧ページに戻るため)
    setParentPagePath(router.asPath);
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
