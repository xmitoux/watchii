import { useEffect } from 'react';

import { Flex } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { EPISODE_CONSTS } from '@/constants/episode-consts';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodeCategoryCard, EpisodeCategoryCardImages } from './components/EpisodeCategoryCard';

const categoryImages: Record<string, EpisodeCategoryCardImages> = {
  long: {
    1: '/images/episode-category/long/episode-category-long-1.webp',
    2: '/images/episode-category/long/episode-category-long-2.webp',
    3: '/images/episode-category/long/episode-category-long-3.webp',
  },
  short: {
    1: '/images/episode-category/short/episode-category-short-1.webp',
    2: '/images/episode-category/short/episode-category-short-2.webp',
    3: '/images/episode-category/short/episode-category-short-3.webp',
  },
  season: {
    1: '/images/episode-category/season/episode-category-season-1.webp',
    2: '/images/episode-category/season/episode-category-season-2.webp',
    3: '/images/episode-category/season/episode-category-season-3.webp',
  },
  other: {
    1: '/images/episode-category/other/episode-category-other-1.webp',
    2: '/images/episode-category/other/episode-category-other-2.webp',
    3: '/images/episode-category/other/episode-category-other-3.webp',
  },
};

/** エピソードカテゴリ一覧 */
export default function EpisodeCategories() {
  const resetEpisodeStore = useNavigationStore('episodes', (state) => state.reset);

  useEffect(() => {
    // エピソード一覧ページのストアをリセット
    // (カテゴリページを開いた時点で一覧の復元状態は不要)
    resetEpisodeStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="エピソードカテゴリ一覧">
      <Flex direction="column" align="center" gap={4}>
        <EpisodeCategoryCard
          title={EPISODE_CONSTS.CATEGORY.LONG.name}
          description="物語が多数のページにわたるエピソードをまとめています。"
          imageUrls={categoryImages.long}
          categoryPathName={EPISODE_CONSTS.CATEGORY.LONG.pathName}
        />
        <EpisodeCategoryCard
          title={EPISODE_CONSTS.CATEGORY.SHORT.name}
          description="ページ数の少ないエピソードをまとめています。"
          imageUrls={categoryImages.short}
          categoryPathName={EPISODE_CONSTS.CATEGORY.SHORT.pathName}
        />
        <EpisodeCategoryCard
          title={EPISODE_CONSTS.CATEGORY.SEASON.name}
          description="季節関連エピソードをまとめています。"
          imageUrls={categoryImages.season}
          categoryPathName={EPISODE_CONSTS.CATEGORY.SEASON.pathName}
        />
        <EpisodeCategoryCard
          title={EPISODE_CONSTS.CATEGORY.OTHER.name}
          description="1話完結のエピソードをまとめています。"
          imageUrls={categoryImages.other}
          categoryPathName={EPISODE_CONSTS.CATEGORY.OTHER.pathName}
        />
      </Flex>
    </Layout>
  );
}
