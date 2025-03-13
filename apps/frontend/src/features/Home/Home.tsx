import { useRouter } from 'next/router';

import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/features/PostGallery/PostGallery';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const router = useRouter();

  return (
    <Layout title="Watchii">
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={4}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={page => router.push(`/home/page/${page}`)}
        />
      </Center>
    </Layout>
  );
}
