import { Box, Flex, SimpleGrid, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { CharacterTag, CuteTag, PopularWords, SectionText } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';

import { TagsProps } from './types/tags-types';

/** タグ一覧画面コンポーネント */
export default function Tags({ characters, tags, popularWordSpeakers }: TagsProps) {
  return (
    <Layout title="タグ管理">
      <Flex direction="column" align="center">
        {/* キャラクターセクション */}
        <SectionText title="キャラ" to="/tags/character/create" />

        {/* キャラタグ一覧 */}
        <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} mb={8}>
          {characters?.map((character) => (
            <Box key={character.id} m={4}>
              <CharacterTag character={character} to={`/tags/character/edit/${character.nameKey}`} />
            </Box>
          ))}
        </SimpleGrid>

        {/* タグセクション */}
        <SectionText title="タグ" to="/tags/tag/create" />

        {/* タグ一覧 - Wrapを使って自動的に折り返す */}
        <Wrap justify="center" mb={8}>
          {tags?.map((tag) => (
            <WrapItem key={tag.id} m={1}>
              <CuteTag id={tag.id} name={tag.name} to={`/tags/tag/edit/${tag.id}`} />
            </WrapItem>
          ))}
        </Wrap>

        {/* 語録セクション */}
        <SectionText title="語録" to="/tags/popular-word/create" />

        {/* 語録一覧 */}
        <PopularWords popularWordSpeakers={popularWordSpeakers} to={(id: number) => `/tags/popular-word/edit/${id}`} />
      </Flex>
    </Layout>
  );
}
