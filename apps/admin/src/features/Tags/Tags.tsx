import Link from 'next/link';
import { MdAdd } from 'react-icons/md';

import { Box, Flex, Icon, SimpleGrid, Text, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { CharacterTag, CuteTag, PopularWords } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';

import { TagsProps } from './types/tags-types';

/** タグ一覧画面コンポーネント */
export default function Tags({ characters, tags, popularWordSpeakers }: TagsProps) {
  const bgColor = { base: 'hachiBlue.light', _dark: 'hachiBlue.dark' };

  return (
    <Layout title="タグ管理">
      <Flex direction="column" align="center">
        {/* キャラクターセクション */}
        <Box
          position="relative"
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

          {/* 登録ボタン */}
          <AddButton to="/tags/character/create" />
        </Box>

        {/* キャラタグ一覧 */}
        <SimpleGrid columns={3} mb={8}>
          {characters?.map((character) => (
            <Box key={character.id} m={4}>
              <CharacterTag character={character} to={`/tags/character/${character.nameKey}`} />
            </Box>
          ))}
        </SimpleGrid>

        {/* タグセクション */}
        <Box
          position="relative"
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

          {/* 登録ボタン */}
          <AddButton to="/tags/tag/create" />
        </Box>

        {/* タグ一覧 - Wrapを使って自動的に折り返す */}
        <Wrap justify="center" mb={8}>
          {tags?.map((tag) => (
            <WrapItem key={tag.id} m={1}>
              <CuteTag tag={tag} to={`/tags/tag/edit/${tag.id}`} />
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
        <PopularWords popularWordSpeakers={popularWordSpeakers} to={(id: number) => `/tags/popular-word/${id}`} />
      </Flex>
    </Layout>
  );
}

type AddButtonProps = {
  to: string;
};

/** 登録ボタン */
function AddButton({ to }: AddButtonProps) {
  return (
    <Link href={to}>
      <Icon
        position="absolute"
        right={4}
        top="11px"
        color="blackSwitch"
        size="lg"
        cursor="pointer"
        _hover={{ color: 'whiteSwitch' }}
        transition="all 0.2s"
      >
        <MdAdd />
      </Icon>
    </Link>
  );
}
