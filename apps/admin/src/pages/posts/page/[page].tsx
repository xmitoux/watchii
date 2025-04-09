import { GetServerSideProps } from 'next';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import { postsApi } from '@/features/Posts/api/posts-api';
import Posts from '@/features/Posts/Posts';
import { PostsProps } from '@/features/Posts/types/posts-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

export const getServerSideProps: GetServerSideProps<PostsProps> = async ({ params }) => {
  try {
    // URLパラメータからページ番号を取得
    const page = Number(params?.page);
    if (!page) {
      return { notFound: true };
    }
    // オフセット計算（何件目から取得するか）
    const offset = (page - 1) * PER_PAGE;

    const { posts, total } = await postsApi.findAllPosts({ limit: PER_PAGE, offset });

    return {
      props: {
        posts,
        total,
        currentPage: page,
        perPage: PER_PAGE,
      },
    };
  }
  catch (error) {
    console.error('Post一覧ページ生成処理に失敗しました。', error);
    return { notFound: true };
  }
};

export default function HomePage(props: PostsProps) {
  return <Posts {...props} />;
}
