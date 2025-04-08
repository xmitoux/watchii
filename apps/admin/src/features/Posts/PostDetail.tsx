import { Box, Flex, SimpleGrid, Text } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';

import { PostDetailProps } from './types/posts-types';

/** Post詳細コンポーネント */
export function PostDetail({ post }: PostDetailProps) {
  const imageWidth = usePostImageWidth({
    tabletWidth: '60vw',
    desktopWidth: '40vh',
  });

  return (
    <Layout title="Post詳細" canBack>
      <Flex direction="column" align="center" gap={4}>
        {/* Post画像 */}
        <NextImage
          src={post.filename}
          width={700}
          styleWidth={imageWidth}
          alt={post.filename}
          priority
        />

        {/* キャラセクション */}
        <SectionText title="キャラ" />

        {/* TODO: 見た目の調整 */}
        {/* キャラタグ一覧 */}
        <SimpleGrid columns={3} mb={8}>
          {post.characters.map((character) => (
            <Box key={character.id} m={4}>
              {character.name}
            </Box>
          ))}
        </SimpleGrid>

        {/* タグセクション */}
        <SectionText title="タグ" />

        {/* タグ一覧 */}
        <SimpleGrid columns={3} mb={8}>
          {post.tags.map((tag) => (
            <Box key={tag.id} m={4}>
              {tag.name}
            </Box>
          ))}
        </SimpleGrid>

        {/* 語録セクション */}
        <SectionText title="語録" />

        {/* 語録一覧 */}
        <SimpleGrid columns={3} mb={8}>
          {post.popularWords.map((popularWord) => (
            <Box key={popularWord.id} m={4}>
              {popularWord.word}
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Layout>
  );
}

type SectionTextProps = {
  title: string;
};

function SectionText({ title }: SectionTextProps) {
  const bgColor = { base: 'hachiBlue.light', _dark: 'hachiBlue.dark' };

  return (
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
        {title}
      </Text>
    </Box>
  );
}
