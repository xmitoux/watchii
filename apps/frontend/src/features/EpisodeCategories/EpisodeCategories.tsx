import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Flex } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { EPISODE_CONSTS } from '@/constants/episode-consts';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodeCategoryCard } from './components/EpisodeCategoryCard';

/** エピソードカテゴリ一覧 */
export default function EpisodeCategories() {
  const router = useRouter();

  const resetEpisodeStore = useNavigationStore('episodes', (state) => state.reset);

  useEffect(() => {
    // エピソード一覧ページのストアをリセット
    // (カテゴリページを開いた時点で一覧の復元状態は不要)
    resetEpisodeStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToEpisodesPage(categoryPathName: string) {
    router.push(`/episodes/categories/${categoryPathName}/page/1`);
  }

  return (
    <Layout title="エピソードカテゴリ一覧">
      <Flex direction="column" align="center" gap={4}>
        <EpisodeCategoryCard
          title="長編エピソード"
          description="物語が多数のページにわたるエピソードをまとめています。"
          imageUrl="20200625_154426-EbXmcdTU8AA39Xq.webp"
          onClick={() => goToEpisodesPage(EPISODE_CONSTS.CATEGORY.LONG.pathName)}
        />
        <EpisodeCategoryCard
          title="短編エピソード"
          description="長編より短いページ数で続くエピソードをまとめています。"
          imageUrl="20200627_151349-EbhynWgUwAEpBNy.webp"
          onClick={() => goToEpisodesPage(EPISODE_CONSTS.CATEGORY.SHORT.pathName)}
        />
        <EpisodeCategoryCard
          title="その他"
          description="1話完結のエピソードをまとめています。"
          imageUrl="20200704_134901-EcFiVgRU0AEE-6p.webp"
          onClick={() => goToEpisodesPage(EPISODE_CONSTS.CATEGORY.OTHER.pathName)}
        />
      </Flex>
    </Layout>
  );
}
