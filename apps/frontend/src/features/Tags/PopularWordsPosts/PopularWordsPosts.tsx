import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

import { useBackToTags } from '../hooks/useBackToTags';
import { PopularWordPostsProps } from '../types/tags-types';

export default function PopularWordsPosts({
  posts,
  total,
  id,
  word,
  currentPage,
  perPage,
}: PopularWordPostsProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: `/tags/popular-word/${id}/page`,
    scrollRef,
  });

  useNavigationRestore('tags', scrollRef);

  const { backToTags } = useBackToTags();

  return (
    <Layout
      title={word}
      scrollRef={scrollRef}
      onNavigationBack={backToTags}
      pagination={{ total, currentPage, perPage, pagination }}
    >
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
