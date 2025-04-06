import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { tagsApi } from '@/features/Tags/api/tags-api';
import TagEdit from '@/features/Tags/Tag/TagEdit/TagEdit';
import { TagEditProps } from '@/features/Tags/types/tags-types';

export const getServerSideProps: GetServerSideProps<TagEditProps>
  = async ({ params }: GetServerSidePropsContext) => {
    try {
      const id = Number(params?.id);
      if (!id) {
        return { notFound: true };
      }

      // タグ詳細をAPIから取得
      const { tag } = await tagsApi.findTag(id);
      if (!tag) {
        return { notFound: true };
      }

      return {
        props: {
          tag,
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
