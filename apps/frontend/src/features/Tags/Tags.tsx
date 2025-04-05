import { useEffect } from 'react';

import { Box, Flex, SimpleGrid, Text, Wrap, WrapItem } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { useNavigationStore } from '@/stores/navigationStore';

import { CharacterTag } from './components/CharacterTag';
import { CuteTag } from './components/CuteTag';
import { TagsProps } from './types/tags-types';

/** タグ一覧画面コンポーネント */
export default function Tags({ characters, tags, popularWordSpeakers }: TagsProps) {
  const resetNavigationStore = useNavigationStore('tags', (state) => state.reset);

  useEffect(() => {
    // ナビゲーションストアをリセット
    resetNavigationStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor = { base: 'hachiBlue.light', _dark: 'hachiBlue.dark' };

  return (
    <Layout title="キャラ・タグ一覧">
      <Flex direction="column" align="center">
        {/* キャラクターセクション */}
        <Box
          w="full"
          bg={bgColor}
          borderRadius="lg"
          py={2}
          mb={4}
          textAlign="center"
        >
          <Text color="blackSwitch" fontSize="xl" fontWeight="bold">
            キャラクター
          </Text>
        </Box>

        {/* キャラタグ一覧 */}
        <SimpleGrid columns={3} mb={8}>
          {characters?.map((character) => (
            <Box key={character.id} m={4}>
              <CharacterTag character={character} />
            </Box>
          ))}
        </SimpleGrid>

        {/* タグセクション */}
        <Box
          w="full"
          bg={bgColor}
          borderRadius="lg"
          py={2}
          mb={4}
          textAlign="center"
        >
          <Text color="blackSwitch" fontSize="xl" fontWeight="bold">
            タグ
          </Text>
        </Box>

        {/* タグ一覧 - Wrapを使って自動的に折り返す */}
        <Wrap justify="center" mb={8}>
          {tags?.map((tag) => (
            <WrapItem key={tag.id} m={1}>
              <CuteTag tag={tag} />
            </WrapItem>
          ))}
        </Wrap>

        {/* 語録セクション */}
        <Box
          w="full"
          bg={bgColor}
          borderRadius="lg"
          py={2}
          mb={4}
          textAlign="center"
        >
          <Text color="blackSwitch" fontSize="xl" fontWeight="bold">
            語録
          </Text>
        </Box>

        {/* 語録一覧 */}
        <Box>
          {popularWordSpeakers?.map((popularWordSpeakers) => (
            <Box key={popularWordSpeakers.speaker.id} m={4}>
              <Text fontWeight="bold">{popularWordSpeakers.speaker.name}</Text>
              {popularWordSpeakers.words.map((word) => (
                <Box key={word.id} m={1}>
                  <Text>{word.word}</Text>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Flex>
    </Layout>
  );
}
