import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Box, Flex, Image, SimpleGrid, Text } from '@repo/ui/chakra-ui';
import { useNextImage } from '@repo/ui/hooks';

import Layout from '@/components/Layout/Layout';
import { useNavigationStore } from '@/stores/navigationStore';

import { CharacterEntity, TagsProps } from './types/tags-types';

type CharacterCardProps = {
  character: CharacterEntity;
};

/** キャラクタータグコンポーネント */
function CharacterTag({ character }: CharacterCardProps) {
  const router = useRouter();

  const src = `chara-icons/${character.iconFilename}`;
  const { imageLoader, imageSrc } = useNextImage({ src, width: 80 });

  function goToCharacterPosts() {
    // キャラクターの投稿一覧ページに遷移
    router.push(`/tags/${character.nameKey}`);
  }

  return (
    <Flex direction="column" align="center" cursor="pointer" onClick={goToCharacterPosts}>
      {/* アイコン */}
      <Image
        asChild
        mb={2}
        border="2px solid"
        borderColor="hachiBlue"
        borderRadius="full"
        objectFit="cover"
        alt=""
      >
        <NextImage
          src={imageSrc}
          loader={imageLoader}
          width={80}
          height={0}
          style={{ width: '80px', height: 'auto' }}
          priority
          alt={character.name}
        />
      </Image>

      {/* キャラ名 */}
      <Text color="blackSwitch" fontWeight="bold" fontSize="md" textAlign="center">
        {character.name}
      </Text>
    </Flex>
  );
}

/** タグ一覧画面コンポーネント */
export default function Tags({ characters }: TagsProps) {
  const resetNavigationStore = useNavigationStore('tags', (state) => state.reset);

  useEffect(() => {
    // ナビゲーションストアをリセット
    resetNavigationStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="キャラ・タグ一覧">
      <Flex direction="column" align="center">
        <Text color="blackSwitch" fontSize="xl" fontWeight="bold" mb={2}>
          キャラクター
        </Text>

        {/* キャラタグ一覧 */}
        <SimpleGrid columns={3}>
          {characters?.map((character) => (
            <Box key={character.id} m={4}>
              <CharacterTag character={character} />
            </Box>
          ))}
        </SimpleGrid>

        {/* 後で実装するタグ一覧セクション */}
        <Text fontSize="xl" fontWeight="bold" my={6}>
          タグ
        </Text>
        <Text>タグ機能は近日実装予定です！</Text>
      </Flex>
    </Layout>
  );
}
