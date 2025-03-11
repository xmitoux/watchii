import { GetStaticPaths, GetStaticProps } from 'next';

import EpisodeDetail from '@/features/EpisodeDetail/EpisodeDetail';
import { EpisodeDetailProps } from '@/features/EpisodeDetail/types';

/**
 * ビルド時に生成する全ページのパスを定義する
 * 静的サイト生成(SSG)でページネーションを実装する際に必要
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // APIからエピソードの総数を取得（ここでは1件だけ取得して総数情報だけ使用）
  const res = await fetch(`${process.env.API_BASE_URL}/episodes?limit=1000`);
  const { episodes } = await res.json();

  // 各エピソードIDからパスを生成
  const paths = episodes.map((episode: { id: number }) => ({
    params: { id: String(episode.id) },
  }));

  return {
    paths,
    fallback: 'blocking', // 新しいエピソードが追加されたときも対応できるように
  };
};

/**
 * 各ページに必要なデータを取得する
 * 各ページのビルド時に実行され、ページコンポーネントにpropsとして渡すデータを準備
 */
export const getStaticProps: GetStaticProps<EpisodeDetailProps> = async ({ params }) => {
  // URLパラメータからエピソードIDを取得
  const id = Number(params?.id);

  const res = await fetch(
    `${process.env.API_BASE_URL}/episodes/${id}?limit=1000`,
  );
  const data = await res.json();

  // ページコンポーネントに渡すpropsを返す
  return {
    props: {
      episodeTitle: data.episodeTitle,
      posts: data.posts,
    },
  };
};

export default function EpisodesPage({ episodeTitle, posts }: EpisodeDetailProps) {
  return <EpisodeDetail episodeTitle={episodeTitle} posts={posts} />;
}
