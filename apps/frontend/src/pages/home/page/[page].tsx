import { GetStaticPaths, GetStaticProps } from 'next';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import Home from '@/features/Home/Home';
import { HomeProps } from '@/features/Home/types/home-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

/**
 * ビルド時に生成する全ページのパスを定義する
 * 静的サイト生成(SSG)でページネーションを実装する際に必要
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // APIから投稿の総数を取得（ここでは1件だけ取得して総数情報だけ使用）
  const res = await fetch(`${process.env.API_BASE_URL}/posts?limit=1`);
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
    fallback: 'blocking', // パスにないページはオンデマンドで生成
  };
};

/**
 * 各ページに必要なデータを取得する
 * 各ページのビルド時に実行され、ページコンポーネントにpropsとして渡すデータを準備
 */
export const getStaticProps: GetStaticProps<HomeProps> = async ({ params }) => {
  // URLパラメータからページ番号を取得（デフォルトは1ページ目）
  const page = Number(params?.page) || 1;
  // オフセット計算（何件目から取得するか）
  const offset = (page - 1) * PER_PAGE;

  try {
    // 指定されたページの投稿データをAPIから取得
    const res = await fetch(
      `${process.env.API_BASE_URL}/posts?limit=${PER_PAGE}&offset=${offset}`,
    );

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const data = await res.json();

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        posts: data.posts,
        total: data.total,
        currentPage: page,
        perPage: PER_PAGE,
      },
      revalidate: 3600, // 1時間ごとに再ビルド
    };
  }
  catch {
    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function HomePage({ posts, total, currentPage, perPage }: HomeProps) {
  return <Home posts={posts} total={total} currentPage={currentPage} perPage={perPage} />;
}
