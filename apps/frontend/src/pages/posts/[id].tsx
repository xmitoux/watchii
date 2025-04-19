import { GetStaticPaths, GetStaticProps } from 'next';

import { fetchData } from '@repo/ui/utils';

import { postsApi } from '@/features/Posts/api/posts-api';
import { PostDetail } from '@/features/Posts/PostDetail';
import { PostDetailProps } from '@/features/Posts/types/posts-types';

export const getStaticPaths: GetStaticPaths = async () => {
  // 全Post取得
  const res = await fetchData('/posts');
  const { posts } = await res.json();

  // 全Postのidパスを生成
  const paths = posts.map(({ id }: { id: number }) => ({
    params: { id: String(id) },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostDetailProps> = async ({ params }) => {
  try {
    const id = Number(params?.id);
    if (!id) {
      return { notFound: true };
    }

    // Post詳細を取得
    const { post } = await postsApi.findPost(id);

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
    return { notFound: true };
  }
};

export default function PostDetailPage(props: PostDetailProps) {
  return (
    <PostDetail {...props} />
  );
}
