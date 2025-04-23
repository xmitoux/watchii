import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

import { useBackToTags } from '../hooks/useBackToTags';
import { CharacterPostsProps } from '../types/tags-types';

export default function CharacterPosts({
  posts,
  total,
  characterNameKey,
  characterName,
  currentPage,
  perPage,
}: CharacterPostsProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: `/tags/character/${characterNameKey}/page`,
    scrollRef,
  });

  useNavigationRestore('tagDetail', scrollRef);

  const { backToTags } = useBackToTags();

  return (
    <Layout
      title={`${characterName}の漫画一覧`}
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
