import { Flex } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';

import { EpisodeCategoryCard } from './components/EpisodeCategoryCard';

/** エピソードカテゴリ一覧 */
export default function EpisodeCategories() {
  return (
    <Layout title="エピソードカテゴリ一覧">
      <Flex direction="column" align="center" gap={4}>
        <EpisodeCategoryCard
          title="長編エピソード"
          description="物語が多数のページにわたるエピソードをまとめています。"
          imageUrl="20200625_154426-EbXmcdTU8AA39Xq.webp"
        />
        <EpisodeCategoryCard
          title="短編エピソード"
          description="長編より短いページ数で続くエピソードをまとめています。"
          imageUrl="20200627_151349-EbhynWgUwAEpBNy.webp"
        />
        <EpisodeCategoryCard
          title="その他"
          description="1話完結のエピソードをまとめています。"
          imageUrl="20200704_134901-EcFiVgRU0AEE-6p.webp"
        />
      </Flex>
    </Layout>
  );
}
