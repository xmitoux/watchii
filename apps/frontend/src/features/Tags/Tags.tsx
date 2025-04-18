import { useEffect } from 'react';

import { Box, Flex, SimpleGrid, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { CharacterTag, CuteTag, PopularWords, SectionText } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { useNavigationStore } from '@/stores/navigationStore';

import { TagsProps } from './types/tags-types';

/** タグ一覧画面コンポーネント */
export default function Tags({ characters, tags, popularWordSpeakers }: TagsProps) {
  const resetNavigationStore = useNavigationStore('tags', (state) => state.reset);

  useEffect(() => {
    // ナビゲーションストアをリセット
    resetNavigationStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="タグ一覧">
      <Flex direction="column" align="center">
        {/* キャラクターセクション */}
        <SectionText title="キャラ" />

        {/* キャラタグ一覧 */}
        <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} mb={8}>
          {characters?.map((character) => (
            <Box key={character.id} m={4}>
              <CharacterTag character={character} to={`/tags/character/${character.nameKey}/page/1`} />
            </Box>
          ))}
        </SimpleGrid>

        {/* タグセクション */}
        <SectionText title="タグ" />

        {/* タグ一覧 - Wrapを使って自動的に折り返す */}
        <Wrap justify="center" mb={8}>
          {tags?.map((tag) => (
            <WrapItem key={tag.id} m={1}>
              <CuteTag tag={tag} to={`/tags/tag/${tag.id}/page/1`} />
            </WrapItem>
          ))}
        </Wrap>

        {/* 語録セクション */}
        <SectionText title="語録" />

        {/* 語録一覧 */}
        <PopularWords popularWordSpeakers={popularWordSpeakers} to={(id: number) => `/tags/popular-word/${id}/page/1`} />
      </Flex>
    </Layout>
  );
}
