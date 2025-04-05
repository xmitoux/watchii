import { useRouter } from 'next/router';

import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

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

  /** ヘッダーの戻るボタン処理 */
  function handleNavigationBack() {
    // エピソードカテゴリ一覧に戻る
    router.push('/tags');
  }

  return (
    <Layout title={`${tagName}の漫画一覧`} scrollRef={scrollRef} onNavigationBack={handleNavigationBack}>
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション(シャトルに隠れないよう余白) */}
      <Center mt={3} mb="60px">
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={pagination}
        />
      </Center>

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
