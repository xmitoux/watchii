import { GetStaticPaths, GetStaticProps } from 'next';

import { EPISODE_CONSTS } from '@/constants/episode-consts';
import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import { getEpisodePagesByCategory, getEpisodesByCategory } from '@/features/Episodes/api/episodes-api';
import Episodes from '@/features/Episodes/Episodes';
import { EpisodesProps } from '@/features/Episodes/types/episodes-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

/**
 * ビルド時に生成する全ページのパスを定義する
 * 静的サイト生成(SSG)でページネーションを実装する際に必要
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  // カテゴリ定数を取得
  const categories = Object.values(EPISODE_CONSTS.CATEGORY);

  // 各カテゴリーに対してページパスを生成
  for (const category of categories) {
    // APIからエピソードの総数を取得
    const total = await getEpisodePagesByCategory({ category: category.id });

    // 必要なページ数を計算（切り上げ）
    const pages = Math.ceil(total / PER_PAGE);

    // 各ページのパスパラメータを生成
    for (let i = 1; i <= pages; i++) {
      paths.push({
        params: {
          category: category.pathName,
          page: String(i),
        },
      });
    }
  }

  // パス情報と fallback 設定を返す
  return {
    paths,
    fallback: false, // パスにないページは404を返す
  };
};

/**
 * 各ページに必要なデータを取得する
 * 各ページのビルド時に実行され、ページコンポーネントにpropsとして渡すデータを準備
 */
export const getStaticProps: GetStaticProps<EpisodesProps> = async ({ params }) => {
  // URLパラメータからカテゴリ名とページ番号を取得
  const category = String(params?.category);
  const page = Number(params?.page) || 1;
  // オフセット計算（何件目から取得するか）
  const offset = (page - 1) * PER_PAGE;

  // カテゴリ名の検証
  const validCategories = Object.values(EPISODE_CONSTS.CATEGORY).map((cat) => cat.pathName);
  if (!validCategories.includes(category)) {
    return {
      notFound: true,
    };
  }

  try {
    // カテゴリ名からカテゴリ定数を取得
    const categoryConst = Object.values(EPISODE_CONSTS.CATEGORY).find((cat) => cat.pathName === category);
    if (!categoryConst) {
      return {
        notFound: true,
      };
    }

    const categoryId = categoryConst.id;

    // 指定されたページのエピソード一覧をAPIから取得
    const data = await getEpisodesByCategory({
      category: categoryId,
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
        categoryPathName: category,
        categoryName: categoryConst.name,
      },
      // revalidate: 3600, // 1時間ごとに再ビルド
    };
  }
  catch (error) {
    console.error(`Error fetching episodes for ${category}:`, error);
    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function EpisodesPage(props: EpisodesProps) {
  return <Episodes {...props} />;
}
