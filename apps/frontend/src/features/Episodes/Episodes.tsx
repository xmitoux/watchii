import { useRouter } from 'next/router';

import { Center, Flex, HStack } from '@repo/ui/chakra-ui';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { EpisodeCard } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';

import Layout from '@/components/Layout/Layout';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '90vw' : 'auto';
  const imageHeight = isMobile ? 'auto' : '80vh';

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
            imageHeight={imageHeight}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

      {/* ページネーション */}
      <Center mt={4}>
        <PaginationRoot
          variant="solid"
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          siblingCount={isMobile ? 0 : 2}
          getHref={page => `/episodes/page/${page}`}
        >
          <HStack px={4}>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Center>
    </Layout>
  );
}
