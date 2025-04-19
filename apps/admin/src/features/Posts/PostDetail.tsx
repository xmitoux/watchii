import { useState } from 'react';

import { Button, Flex, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { CharacterIcon, CuteFormTag, NextImage, SectionText } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useToast } from '@/hooks/useToast';

import { postsApi } from './api/posts-api';
import { UpdatePostCharactersRequest, UpdatePostPopularWordsRequest, UpdatePostTagsRequest } from './api/posts-api-types';
import { PostDetailCharacterEntity, PostDetailPopularWordEntity, PostDetailProps, PostDetailTagEntity } from './types/posts-types';

/** Post詳細コンポーネント */
export function PostDetail({
  post,
  charactersMaster,
  tagsMaster,
  popularWordsMaster,
}: PostDetailProps) {
  const { showCompleteToast, showErrorToast } = useToast();

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

  const [updateCharacterLoading, setUpdateCharacterLoading] = useState(false);

  async function updateCharacters() {
    try {
      setUpdateCharacterLoading(true);

      // 更新API実行
      const request: UpdatePostCharactersRequest = { postId: post.id, characterIds: selectedCharacters };
      await postsApi.updatePostCharacters(request);

      showCompleteToast('キャラ更新完了！🪄');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'キャラ更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setUpdateCharacterLoading(false);
    }
  }

  const [updateTagLoading, setUpdateTagLoading] = useState(false);

  async function updateTags() {
    try {
      setUpdateTagLoading(true);

      // 更新API実行
      const request: UpdatePostTagsRequest = { postId: post.id, tagIds: selectedTags };
      await postsApi.updatePostTags(request);

      showCompleteToast('タグ更新完了！🏷️');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'タグ更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setUpdateTagLoading(false);
    }
  }

  const [updatePopularWordLoading, setUpdatePopularWordLoading] = useState(false);

  async function updatePopularWords() {
    try {
      setUpdatePopularWordLoading(true);

      // 更新API実行
      const request: UpdatePostPopularWordsRequest = { postId: post.id, popularWordIds: selectedPopularWords };
      await postsApi.updatePostPopularWords(request);

      showCompleteToast('語録更新完了！📜');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '語録更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setUpdatePopularWordLoading(false);
    }
  }

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
        <SectionText title="キャラ" to="/tags/character/create" />

        {/* キャラタグ一覧 */}
        <TagList
          items={charactersMaster}
          selectedIds={selectedCharacters}
          toggleItem={toggleCharacter}
          renderItem={(character, isSelected) => (
            <CuteFormTag
              id={character.id}
              name={character.name}
              isSelected={isSelected}
              startElement={
                <CharacterIcon character={character} iconSize="40px" borderSize={0} />
              }
            />
          )}
        />
        <Button bg="hachiBlueSwitch" color="blackSwitch" mb={8} loading={updateCharacterLoading} onClick={updateCharacters}>
          キャラを更新する
        </Button>

        {/* タグセクション */}
        <SectionText title="タグ" to="/tags/tag/create" />

        {/* タグ一覧 */}
        <TagList
          items={tagsMaster}
          selectedIds={selectedTags}
          toggleItem={toggleTag}
          renderItem={(tag, isSelected) => (
            <CuteFormTag id={tag.id} name={tag.name} isSelected={isSelected} />
          )}
        />
        <Button bg="hachiBlueSwitch" color="blackSwitch" mb={8} loading={updateTagLoading} onClick={updateTags}>
          タグを更新する
        </Button>

        {/* 語録セクション */}
        <SectionText title="語録" to="/tags/popular-word/create" />

        {/* 語録一覧 */}
        <TagList
          items={popularWordsMaster}
          selectedIds={selectedPopularWords}
          toggleItem={togglePopularWord}
          renderItem={(word, isSelected) => (
            <CuteFormTag id={word.id} name={word.word} isSelected={isSelected} />
          )}
        />
        <Button bg="hachiBlueSwitch" color="blackSwitch" mb={8} loading={updatePopularWordLoading} onClick={updatePopularWords}>
          語録を更新する
        </Button>
      </Flex>
    </Layout>
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
