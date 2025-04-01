import { GetStaticPaths, GetStaticProps } from 'next';

import EpisodeDetail from '@/features/EpisodeDetail/EpisodeDetail';
import { EpisodeDetailProps } from '@/features/EpisodeDetail/types/episode-detail-types';
import { fetchData } from '@/utils/fetch';

/**
 * ビルド時に生成する全ページのパスを定義する
 * 静的サイト生成(SSG)でページネーションを実装する際に必要
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // APIからエピソードの総数を取得（ここでは1件だけ取得して総数情報だけ使用）
  const res = await fetchData('/episodes?limit=1000');
  const { episodes } = await res.json();

  // 各エピソードIDからパスを生成
  const paths = episodes.map((episode: { id: number }) => ({
    params: { id: String(episode.id) },
  }));

  return {
    paths,
    fallback: false, // パスにないページは404を返す
  };
};

/**
 * 各ページに必要なデータを取得する
 * 各ページのビルド時に実行され、ページコンポーネントにpropsとして渡すデータを準備
 */
export const getStaticProps: GetStaticProps<EpisodeDetailProps> = async ({ params }) => {
  // URLパラメータからエピソードIDを取得
  const id = Number(params?.id);

  try {
    const res = await fetchData(`/episodes/${id}?limit=1000`);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const data = await res.json();

    // ページコンポーネントに渡すpropsを返す
    return {
      props: {
        episodeTitle: data.episodeTitle,
        posts: data.posts,
      },
      // revalidate: 3600, // 1時間ごとに再ビルド
    };
  }
  catch {
    // エラーが発生した場合は404ページを表示
    return {
      notFound: true,
    };
  }
};

export default function EpisodesPage({ episodeTitle, posts }: EpisodeDetailProps) {
  return <EpisodeDetail episodeTitle={episodeTitle} posts={posts} />;
}
