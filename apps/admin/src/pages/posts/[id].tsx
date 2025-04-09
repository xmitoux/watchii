import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { postsApi } from '@/features/Posts/api/posts-api';
import { PostDetail } from '@/features/Posts/PostDetail';
import { PostDetailProps } from '@/features/Posts/types/posts-types';
import { tagsApi } from '@/features/Tags/api/tags-api';

export const getServerSideProps: GetServerSideProps<PostDetailProps>
  = async ({ params }: GetServerSidePropsContext) => {
    try {
      const id = Number(params?.id);
      if (!id) {
        return { notFound: true };
      }

      const [{ post }, { characters }, { tags }] = await Promise.all([
        // Post詳細を取得
        postsApi.findPost(id),
        // キャラクター一覧をAPIから取得
        tagsApi.findAllCharacters(),
        // タグ一覧をAPIから取得
        tagsApi.findAllTags(),
      ]);

      if (!post) {
        return { notFound: true };
      }

      return {
        props: {
          post,
        },
      };
    }
    catch (error) {
      console.error('Post詳細ページ生成処理に失敗しました。', error);
      // エラーが発生した場合は404ページを表示
      return { notFound: true };
    }
  };

export default function PostDetailPage(props: PostDetailProps) {
  return (
    <PostDetail {...props} />
  );
}
