import { useRouter } from 'next/router';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { Pagination } from '@/components/Pagination/Pagination';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  const imageWidth = usePostImageWidth();

  const router = useRouter();

  function handleImageClick(episodeId: number) {
    router.push(`/episodes/ep/${episodeId}`);
  }

  return (
    <Layout title="エピソード一覧">
      {/* エピソード一覧 */}
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {episodes?.map(episode => (
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
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          destination="/episodes/page/"
        />
      </Center>
    </Layout>
  );
}
