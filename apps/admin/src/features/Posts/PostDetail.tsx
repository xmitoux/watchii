import { useState } from 'react';

import { Box, Button, Flex, Text, Wrap, WrapItem } from '@repo/ui/chakra-ui';
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

  // 選択中のタグを状態として保持
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>(
    post.characters.map((character) => character.id),
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(
    post.tags.map((tag) => tag.id),
  );
  const [selectedPopularWords, setSelectedPopularWords] = useState<number[]>(
    post.popularWords.map((word) => word.id),
  );

  // キャラクターのトグル処理
  const toggleCharacter = (id: number) => {
    setSelectedCharacters((prev) =>
      prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id]);
  };

  // タグのトグル処理
  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]);
  };

  // 語録のトグル処理
  const togglePopularWord = (id: number) => {
    setSelectedPopularWords((prev) =>
      prev.includes(id) ? prev.filter((wordId) => wordId !== id) : [...prev, id]);
  };

  // 更新処理（APIリクエストはここに実装予定）
  const updateCharacters = () => {
    console.log('キャラ更新:', selectedCharacters);
    // ここにAPI呼び出しを実装予定
  };

  const updateTags = () => {
    console.log('タグ更新:', selectedTags);
    // ここにAPI呼び出しを実装予定
  };

  const updatePopularWords = () => {
    console.log('語録更新:', selectedPopularWords);
    // ここにAPI呼び出しを実装予定
  };

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
          items={charactersMaster}
          selectedIds={selectedCharacters}
          toggleItem={toggleCharacter}
          renderItem={(character, isSelected) => (
            <CharacterTag character={character} isSelected={isSelected} />
          )}
        />
        <Button colorScheme="blue" mb={8} onClick={updateCharacters}>
          キャラを更新する
        </Button>

        {/* タグセクション */}
        <SectionText title="タグ" />

        {/* タグ一覧 */}
        <TagList
          items={tagsMaster}
          selectedIds={selectedTags}
          toggleItem={toggleTag}
          renderItem={(tag, isSelected) => (
            <PostTag item={tag} isSelected={isSelected} />
          )}
        />
        <Button colorScheme="blue" mb={8} onClick={updateTags}>
          タグを更新する
        </Button>

        {/* 語録セクション */}
        <SectionText title="語録" />

        {/* 語録一覧 */}
        <TagList
          items={popularWordsMaster}
          selectedIds={selectedPopularWords}
          toggleItem={togglePopularWord}
          renderItem={(word, isSelected) => (
            <PostTag item={word} isSelected={isSelected} />
          )}
        />
        <Button colorScheme="blue" mb={8} onClick={updatePopularWords}>
          語録を更新する
        </Button>
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
  selectedIds: number[];
  toggleItem: (id: number) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
};

function TagList<T extends TagListItem>({ items, selectedIds, toggleItem, renderItem }: TagListProps<T>) {
  return (
    <Wrap justify="center" mb={4}>
      {items.map((item) => (
        <WrapItem key={item.id} m={1} onClick={() => toggleItem(item.id)}>
          {renderItem(item, selectedIds.includes(item.id))}
        </WrapItem>
      ))}
    </Wrap>
  );
}

type CharacterTagProps = {
  character: PostDetailCharacterEntity;
  isSelected: boolean;
};

function CharacterTag({ character, isSelected }: CharacterTagProps) {
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

  // 選択されているかどうかでスタイルを変更
  const bgColor = isSelected ? tagColor.bg : 'gray.100';
  const borderColor = isSelected ? tagColor.border : 'gray.300';
  const textColor = isSelected ? tagColor.text : 'gray.500';
  const hoverBg = isSelected ? tagColor.hover : 'gray.200';

  return (
    <Tag
      size="xl"
      variant="solid"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
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
        bg: hoverBg,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
    >
      <Text color={textColor} fontSize="md">
        {character.name}
      </Text>
    </Tag>
  );
}

type PostTagProps = {
  item: PostDetailTagEntity | PostDetailPopularWordEntity;
  isSelected: boolean;
};

function PostTag({ item, isSelected }: PostTagProps) {
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

  // 選択されているかどうかでスタイルを変更
  const bgColor = isSelected ? tagColor.bg : 'gray.100';
  const borderColor = isSelected ? tagColor.border : 'gray.300';
  const textColor = isSelected ? tagColor.text : 'gray.500';
  const hoverBg = isSelected ? tagColor.hover : 'gray.200';

  return (
    <Tag
      size="lg"
      variant="solid"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="full"
      boxShadow="sm"
      py={2}
      px={4}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
    >
      <Text color={textColor} fontSize="md">
        {'name' in item ? item.name : item.word}
      </Text>
    </Tag>
  );
}
