import { GetServerSideProps } from 'next';

import { tagsApi } from '@/features/Tags/api/tags-api';
import PopularWordCreate from '@/features/Tags/PopularWord/PopularWordCreate/PopularWordCreate';
import { PopularWordCreateProps } from '@/features/Tags/types/tags-types';

export const getServerSideProps: GetServerSideProps<PopularWordCreateProps> = async () => {
  try {
    // キャラクター一覧をAPIから取得
    const { characters } = await tagsApi.findAllCharacters();

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        characters,
      },
    };
  }
  catch (error) {
    console.error('語録登録ページ生成処理に失敗しました。', error);
    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function PopularWordCreatePage({ characters }: PopularWordCreateProps) {
  return <PopularWordCreate characters={characters} />;
}
