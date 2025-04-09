import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/components/PostGallery';

import { PostsProps } from './types/posts-types';

export default function Posts({ posts, total, currentPage, perPage }: PostsProps) {
  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/posts/page',
  });

  return (
    <Layout title="Post一覧">
      {/* ページネーション */}
      <Center mb={3}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={pagination}
        />
      </Center>

      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={3}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={pagination}
        />
      </Center>
    </Layout>
  );
}
