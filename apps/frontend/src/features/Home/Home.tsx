import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useTagsNavigationToggle } from '@/hooks/useTagsNavigationToggle';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/home/page',
    scrollRef,
  });

  useNavigationRestore('home', scrollRef);
  useTagsNavigationToggle(true);

  return (
    <Layout title="Watchii" scrollRef={scrollRef} pagination={{ total, currentPage, perPage, pagination }}>
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* Postページシャトル */}
      <PostPageShuttle
        scrollRef={scrollRef}
        postsPerPage={posts.length}
        postsTotal={total}
        pageOffset={currentPage * perPage - perPage}
      />
    </Layout>
  );
}
