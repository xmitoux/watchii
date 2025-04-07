import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { tagsApi } from '@/features/Tags/api/tags-api';
import PopularWordEdit from '@/features/Tags/PopularWord/PopularWordEdit/PopularWordEdit';
import { PopularWordEditProps } from '@/features/Tags/types/tags-types';

export const getServerSideProps: GetServerSideProps<PopularWordEditProps>
  = async ({ params }: GetServerSidePropsContext) => {
    try {
      const id = Number(params?.id);
      if (!id) {
        return { notFound: true };
      }

      // 語録詳細をAPIから取得
      const { popularWord } = await tagsApi.findPopularWord(id);
      if (!popularWord) {
        return { notFound: true };
      }

      return {
        props: {
          popularWord,
        },
      };
    }
    catch (error) {
      console.error('語録編集ページ生成処理に失敗しました。', error);
      // エラーが発生した場合は404ページを表示
      return { notFound: true };
    }
  };

export default function PopularWordEditPage(props: PopularWordEditProps) {
  return (
    <PopularWordEdit {...props} />
  );
}
