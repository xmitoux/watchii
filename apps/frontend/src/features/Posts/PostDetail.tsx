import { Box, Flex, Wrap, WrapItem } from '@repo/ui/chakra-ui';
import { CharacterTag, CuteLinkTag, NextImage, PopularWords, SectionText } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useNavigationStore } from '@/stores/navigationStore';

import PostDetailFavButton from './components/PostDetailFavButton';
import { PostDetailProps, PostDetailTagEntity } from './types/posts-types';

/** Post詳細コンポーネント */
export function PostDetail({ post }: PostDetailProps) {
  const imageWidth = usePostImageWidth();
  const resetTagDetailStore = useNavigationStore('tagDetail', (state) => state.reset);

  return (
    <Layout title="漫画詳細" canBack noFooter noMenu>
      <Flex direction="column" align="center" gap={4}>
        {/* Post画像 */}
        <NextImage
          src={post.filename}
          width={700}
          styleWidth={imageWidth}
          alt={post.filename}
          priority
        />

        {/* お気に入りボタン */}
        <PostDetailFavButton post={post} />

        {/* キャラセクション */}
        <SectionText title="キャラ" />

        {/* キャラタグ一覧 */}
        <TagList
          items={post.characters}
          renderItem={(character) => (
            // 遷移時にタグ詳細のスクロール位置が復元されないようにする
            <Box onClick={() => resetTagDetailStore()}>
              <CharacterTag character={character} to={`/tags/character/${character.nameKey}/page/1`} />
            </Box>
          )}
        />

        {/* タグセクション */}
        <SectionText title="タグ" />

        {/* タグ一覧 */}
        <TagList
          items={post.tags}
          renderItem={(tag) => (
            // 遷移時にタグ詳細のスクロール位置が復元されないようにする
            <Box onClick={() => resetTagDetailStore()}>
              <CuteLinkTag id={tag.id} name={tag.name} to={`/tags/tag/${tag.id}/page/1`} />
            </Box>
          )}
        />

        {/* 語録セクション */}
        <SectionText title="語録" />

        {/* 語録一覧 */}
        <PopularWords
          popularWordSpeakers={post.popularWords}
          to={(id: number) => `/tags/popular-word/${id}/page/1`}
          onClick={() => resetTagDetailStore()} // 遷移時にタグ詳細のスクロール位置が復元されないようにする
        />
      </Flex>
    </Layout>
  );
}

type TagListItem = PostDetailTagEntity;

type TagListProps<T extends TagListItem> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function TagList<T extends TagListItem>({ items, renderItem }: TagListProps<T>) {
  return (
    <Wrap justify="center" mb={4}>
      {items.map((item) => (
        <WrapItem key={item.id} m={1}>
          {renderItem(item)}
        </WrapItem>
      ))}
    </Wrap>
  );
}
