import { GetStaticPaths, GetStaticProps } from 'next';

import { EPISODE_CONSTS } from '@/constants/episode-consts';
import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import { getEpisodePagesByCategory, getEpisodesByCategory } from '@/features/Episodes/api/episodes-api';
import Episodes from '@/features/Episodes/Episodes';
import { EpisodesProps } from '@/features/Episodes/types/episodes-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;
const CATEGORY = EPISODE_CONSTS.CATEGORY.LONG.id;

/**
 * ビルド時に生成する全ページのパスを定義する
 * 静的サイト生成(SSG)でページネーションを実装する際に必要
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // APIからエピソードの総数を取得（ここでは1件だけ取得して総数情報だけ使用）
  const total = await getEpisodePagesByCategory({ category: CATEGORY });

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
    fallback: false, // パスにないページは404になる
  };
};

/**
 * 各ページに必要なデータを取得する
 * 各ページのビルド時に実行され、ページコンポーネントにpropsとして渡すデータを準備
 */
export const getStaticProps: GetStaticProps<EpisodesProps> = async ({ params }) => {
  // URLパラメータからページ番号を取得（デフォルトは1ページ目）
  const page = Number(params?.page) || 1;
  // オフセット計算（何件目から取得するか）
  const offset = (page - 1) * PER_PAGE;

  try {
    // 指定されたページのエピソード一覧をAPIから取得
    const data = await getEpisodesByCategory({
      category: CATEGORY,
      perPage: PER_PAGE,
      offset,
    });

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        episodes: data.episodes,
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

export default function EpisodesPage({ episodes, total, currentPage, perPage }: EpisodesProps) {
  return <Episodes episodes={episodes} total={total} currentPage={currentPage} perPage={perPage} />;
}
