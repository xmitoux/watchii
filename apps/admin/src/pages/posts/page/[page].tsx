import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import { fetchData } from '@repo/ui/utils';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import { postsApi } from '@/features/Posts/api/posts-api';
import Posts from '@/features/Posts/Posts';
import { PostsProps } from '@/features/Posts/types/posts-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

export const getStaticPaths: GetStaticPaths = async () => {
  // APIから投稿の総数を取得（ここでは1件だけ取得して総数情報だけ使用）
  const res = await fetchData('/posts?limit=1');
  const { total } = await res.json();

  // 必要なページ数を計算（切り上げ）
  const pages = Math.ceil(total / PER_PAGE);

  // 各ページのパスパラメータを生成
  // Array.from で指定した長さの配列を生成し、各要素をマップしてパスオブジェクトに変換
  const paths = Array.from({ length: pages }, (_, i) => ({
    params: { page: String(i + 1) },
  }));

  // パス情報と fallback 設定を返す
  return {
    paths, // 生成するすべてのページパス
    fallback: false, // パスにないページは404を返す
  };
};

// TODO: タグ付け作業中はSSGにする
// export const getServerSideProps: GetServerSideProps<PostsProps> = async ({ params }) => {
//   try {
//     // URLパラメータからページ番号を取得
//     const page = Number(params?.page);
//     if (!page) {
//       return { notFound: true };
//     }
//     // オフセット計算（何件目から取得するか）
//     const offset = (page - 1) * PER_PAGE;

//     const { posts, total } = await postsApi.findAllPosts({ limit: PER_PAGE, offset });

//     return {
//       props: {
//         posts,
//         total,
//         currentPage: page,
//         perPage: PER_PAGE,
//       },
//     };
//   }
//   catch (error) {
//     console.error('Post一覧ページ生成処理に失敗しました。', error);
//     return { notFound: true };
//   }
// };

export const getStaticProps: GetStaticProps<PostsProps> = async ({ params }) => {
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
