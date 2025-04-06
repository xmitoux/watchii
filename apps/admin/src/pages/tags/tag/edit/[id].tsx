import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import TagEdit from '@/features/Tags/Tag/TagEdit/TagEdit';
import { TagEditProps } from '@/features/Tags/types/tags-types';

// TODO: SSR props
// [id]でタグ詳細取得APIを実行

export const getServerSideProps: GetServerSideProps<TagEditProps>
  = async ({ params }: GetServerSidePropsContext) => {
    try {
      const id = Number(params?.id);
      if (!id) {
        return { notFound: true };
      }

      // TODO: タグ詳細をAPIから取得
      // const { tag } = await tagsApi.findAllTags();

      return {
        props: {
          tag: { id: 1, name: `ID: ${id}`, kana: 'りこ' },
        },
      };
    }
    catch (error) {
      console.error('タグ編集ページ生成処理に失敗しました。', error);
      // エラーが発生した場合は404ページを表示
      return { notFound: true };
    }
  };

export default function TagEditPage(props: TagEditProps) {
  return (
    <TagEdit {...props} />
  );
}
