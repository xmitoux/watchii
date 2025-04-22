import { useRouter } from 'next/router';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useTagsNavigationStore } from '@/stores/tagsNavigationStore';

import { TagPostsProps } from '../types/tags-types';

export default function TagPosts({
  posts,
  total,
  id,
  tagName,
  currentPage,
  perPage,
}: TagPostsProps) {
  const router = useRouter();

  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: `/tags/tag/${id}/page`,
    scrollRef,
  });

  useNavigationRestore('tags', scrollRef);
  const { shouldBackToTags } = useTagsNavigationStore();

  /** ヘッダーの戻るボタン処理 */
  function handleNavigationBack() {
    // エピソードカテゴリ一覧に戻る
    if (shouldBackToTags) {
      router.push('/tags');
    }
    else {
      router.back();
    }
  }

  return (
    <Layout
      title={`${tagName}の漫画一覧`}
      scrollRef={scrollRef}
      onNavigationBack={handleNavigationBack}
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
