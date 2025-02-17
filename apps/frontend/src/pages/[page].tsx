import { GetStaticPaths, GetStaticProps } from 'next';

import Home from '@/features/Home/Home';

export const getStaticPaths: GetStaticPaths = async () => {
  // 前回作ったgetStaticPathsをここに移動！🚀
  const res = await fetch(`${process.env.API_BASE_URL}/posts?limit=1`);
  const { total } = await res.json();

  const PER_PAGE = 12;
  const pages = Math.ceil(total / PER_PAGE);

  const paths = Array.from({ length: pages }, (_, i) => ({
    params: { page: String(i + 1) },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 前回作ったgetStaticPropsをここに移動！⚡️
  const page = Number(params?.page) || 1;
  const PER_PAGE = 12;
  const offset = (page - 1) * PER_PAGE;

  const res = await fetch(
    `${process.env.API_BASE_URL}/posts?limit=${PER_PAGE}&offset=${offset}`,
  );
  const data = await res.json();

  return {
    props: {
      posts: data.posts,
      total: data.total,
      currentPage: page,
    },
  };
};

type PostFindAllResponse = {
  posts: {
    id: number;
    filename: string;
  }[];
  total: number;
};

// コンポーネントのpropsを更新！🔄
type HomeProps = {
  posts: PostFindAllResponse['posts'];
  total: number;
  currentPage: number;
};

// ここでHomeコンポーネントにpropsを渡すよ！🎯
export default function HomePage({ posts, total, currentPage }: HomeProps) {
  return <Home posts={posts} total={total} currentPage={currentPage} />;
}
