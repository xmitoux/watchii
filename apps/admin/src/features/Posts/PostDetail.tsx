import { Box, Flex, Text, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { Tag } from '@repo/ui/chakra-ui/tag';
import { CharacterIcon, NextImage } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';

import { PostDetailCharacterEntity, PostDetailPopularWordEntity, PostDetailProps, PostDetailTagEntity } from './types/posts-types';

/** Post詳細コンポーネント */
export function PostDetail({
  post,
  charactersMaster,
  tagsMaster,
  popularWordsMaster,
}: PostDetailProps) {
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

        {/* キャラタグ一覧 */}
        <TagList
          items={post.characters}
          renderItem={(character) => (
            <CharacterTag character={character} />
          )}
        />

        {/* タグセクション */}
        <SectionText title="タグ" />

        {/* タグ一覧 */}
        <TagList
          items={post.tags}
          renderItem={(tag) => (
            <PostTag item={tag} />
          )}
        />

        {/* 語録セクション */}
        <SectionText title="語録" />

        {/* 語録一覧 */}
        <TagList
          items={post.popularWords}
          renderItem={(word) => (
            <PostTag item={word} />
          )}
        />
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

type TagListItem = PostDetailCharacterEntity | PostDetailTagEntity | PostDetailPopularWordEntity;

type TagListProps<T extends TagListItem> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function TagList<T extends TagListItem>({ items, renderItem }: TagListProps<T>) {
  return (
    <Wrap justify="center" mb={8}>
      {items.map((item) => (
        <WrapItem key={item.id} m={1}>
          {renderItem(item)}
        </WrapItem>
      ))}
    </Wrap>
  );
}

type CharacterTagProps = {
  character: PostDetailCharacterEntity;
};

function CharacterTag({ character }: CharacterTagProps) {
  // カラーパレット - パステルカラーをランダムに選択
  const tagColors = [
    { bg: 'pink.100', hover: 'pink.200', border: 'pink.300', text: 'pink.800' },
    { bg: 'purple.100', hover: 'purple.200', border: 'purple.300', text: 'purple.800' },
    { bg: 'blue.100', hover: 'blue.200', border: 'blue.300', text: 'blue.800' },
    { bg: 'teal.100', hover: 'teal.200', border: 'teal.300', text: 'teal.800' },
    { bg: 'green.100', hover: 'green.200', border: 'green.300', text: 'green.800' },
    { bg: 'yellow.100', hover: 'yellow.200', border: 'yellow.300', text: 'yellow.800' },
    { bg: 'orange.100', hover: 'orange.200', border: 'orange.300', text: 'orange.800' },
  ];

  // タグごとに固定のカラーを選ぶ（タグのIDに基づく）
  const colorIndex = character.id % tagColors.length;
  const tagColor = tagColors[colorIndex]!;

  return (
    <Tag
      size="xl"
      variant="solid"
      bg={tagColor.bg}
      borderWidth="1px"
      borderColor={tagColor.border}
      borderRadius="full"
      boxShadow="sm"
      py={2}
      px={4}
      cursor="pointer"
      startElement={
        <CharacterIcon character={character} iconSize="40px" borderSize={0} />
      }
      transition="all 0.2s"
      _hover={{
        bg: tagColor.hover,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
    >
      <Text color={tagColor.text} fontSize="md">
        {character.name}
      </Text>
    </Tag>
  );
}

type PostTagProps = {
  item: PostDetailTagEntity | PostDetailPopularWordEntity;
};

function PostTag({ item }: PostTagProps) {
  // カラーパレット - パステルカラーをランダムに選択
  const tagColors = [
    { bg: 'pink.100', hover: 'pink.200', border: 'pink.300', text: 'pink.800' },
    { bg: 'purple.100', hover: 'purple.200', border: 'purple.300', text: 'purple.800' },
    { bg: 'blue.100', hover: 'blue.200', border: 'blue.300', text: 'blue.800' },
    { bg: 'teal.100', hover: 'teal.200', border: 'teal.300', text: 'teal.800' },
    { bg: 'green.100', hover: 'green.200', border: 'green.300', text: 'green.800' },
    { bg: 'yellow.100', hover: 'yellow.200', border: 'yellow.300', text: 'yellow.800' },
    { bg: 'orange.100', hover: 'orange.200', border: 'orange.300', text: 'orange.800' },
  ];

  // タグごとに固定のカラーを選ぶ（タグのIDに基づく）
  const colorIndex = item.id % tagColors.length;
  const tagColor = tagColors[colorIndex]!;

  return (
    <Tag
      size="lg"
      variant="solid"
      bg={tagColor.bg}
      borderWidth="1px"
      borderColor={tagColor.border}
      borderRadius="full"
      boxShadow="sm"
      py={2}
      px={4}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: tagColor.hover,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
    >
      <Text color={tagColor.text} fontSize="md">
        {'name' in item ? item.name : item.word}
      </Text>
    </Tag>
  );
}
