import { useRouter } from 'next/router';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { EpisodeCard } from '@repo/ui/components';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { useDeviceType } from '@repo/ui/hooks';
import { MdAdd } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';

import type { EpisodeItem } from '@repo/ui/types';

type EpisodeFindAllResponse = {
  episodes: EpisodeItem[];
  total: number;
};

export default function Episodes() {
  const {
    data,
    error,
    isLoading,
    isLoadingMore,
    observerRef,
    total,
  } = useInfiniteScroll<EpisodeFindAllResponse>({
    baseUrl: '/api/episodes',
  });

  // 全投稿を結合
  const allEpisodes = data ? data.flatMap((page) => page.episodes) : [];

  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '300px';

  const router = useRouter();

  function handleImageClick(episodeId: number) {
    router.push(`/episodes/${episodeId}`);
  }

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Layout
      title="エピソード一覧"
      // 登録画面を開くボタン
      actionButton={(
        <Button variant="plain" onClick={() => router.push('/episodes/create')}>
          <MdAdd />
        </Button>
      )}
    >
      {/* エピソード一覧 */}
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {allEpisodes?.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            imageWidth={imageWidth}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

      {/* ローディング状態の表示 */}
      {isLoadingMore && (
        <Center p={4}>読み込み中...🔄</Center>
      )}

      {/* 無限スクロール用の監視対象要素 */}
      {allEpisodes.length < total && (
        <div ref={observerRef} style={{ height: '10px' }} />
      )}
    </Layout>
  );
}
