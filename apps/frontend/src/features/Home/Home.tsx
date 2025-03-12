import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/features/PostGallery/PostGallery';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  return (
    <Layout title="Watchii">
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={4}>
        <Pagination
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          destination="/home/page"
        />
      </Center>
    </Layout>
  );
}
