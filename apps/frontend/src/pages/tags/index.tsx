import { GetStaticProps } from 'next';

import { tagsApi } from '@/features/Tags/api/tags-api';
import Tags from '@/features/Tags/Tags';
import { TagsProps } from '@/features/Tags/types/tags-types';

export const getStaticProps: GetStaticProps<TagsProps> = async () => {
  try {
    // キャラクター一覧をAPIから取得
    const { characters } = await tagsApi.findAllCharacters();
    // タグ一覧をAPIから取得
    const { tags } = await tagsApi.findAllTags();
    // 語録一覧をAPIから取得
    const { popularWordSpeakers } = await tagsApi.findAllPopularWordSpeakers();

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        characters,
        tags,
        popularWordSpeakers,
      },
    };
  }
  catch (error) {
    console.error('タグ一覧ページ生成処理に失敗しました。', error);
    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function TagsPage(props: TagsProps) {
  return <Tags {...props} />;
}
