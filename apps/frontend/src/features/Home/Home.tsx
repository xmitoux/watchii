import { Center, HStack } from '@repo/ui/chakra-ui';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { useDeviceType } from '@repo/ui/hooks';

import Layout from '@/components/Layout/Layout';
import { PostGallery } from '@/features/PostGallery/PostGallery';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const { isMobile } = useDeviceType();

  return (
    <Layout title="Watchii">
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={4}>
        <PaginationRoot
          variant="solid"
          count={total}
          pageSize={perPage}
          defaultPage={currentPage}
          siblingCount={isMobile ? 0 : 2}
          getHref={page => `/${page}`}
        >
          <HStack px={4}>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Center>
    </Layout>
  );
}
