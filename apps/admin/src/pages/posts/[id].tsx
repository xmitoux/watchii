import { GetStaticPaths, GetStaticProps } from 'next';

import { fetchData } from '@repo/ui/utils';

import { postsApi } from '@/features/Posts/api/posts-api';
import { PostDetail } from '@/features/Posts/PostDetail';
import { PostDetailProps } from '@/features/Posts/types/posts-types';
import { tagsApi } from '@/features/Tags/api/tags-api';

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

    const [{ post }, { characters }, { tags }, { popularWords }] = await Promise.all([
      // Post詳細を取得
      postsApi.findPost(id),
      // キャラクター一覧をAPIから取得
      tagsApi.findAllCharacters(),
      // タグ一覧をAPIから取得
      tagsApi.findAllTags(),
      // 語録一覧をAPIから取得
      tagsApi.findAllPopularWords(),
    ]);

    if (!post) {
      return { notFound: true };
    }

    return {
      props: {
        post,
        charactersMaster: characters,
        tagsMaster: tags,
        popularWordsMaster: popularWords,
      },
      revalidate: 30, // ISR: 30秒ごとに再生成
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
