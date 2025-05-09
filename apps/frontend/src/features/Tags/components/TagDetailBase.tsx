import { Center, Icon } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { MdKeyboardArrowLeft } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useBackToTags } from '@/features/Tags/hooks/useBackToTags';
import { TagDetailPostsProps } from '@/features/Tags/types/tags-types';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

type TagDetailBaseProps = TagDetailPostsProps & {
  pageTitle: string;
  paginationPath: string;
};

export default function TagDetailBase({
  posts,
  total,
  currentPage,
  perPage,
  pageTitle,
  paginationPath,
}: TagDetailBaseProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: `/tags/${paginationPath}/page`,
    scrollRef,
  });

  useNavigationRestore('tagDetail', scrollRef);

  const { backToTags } = useBackToTags();

  return (
    <Layout
      title={pageTitle}
      scrollRef={scrollRef}
      onNavigationBack={backToTags}
      pagination={{ total, currentPage, perPage, pagination }}
    >
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* 一覧に戻るボタン */}
      <Center mt={3}>
        <BasicButton variant="outline" w="180px" onClick={backToTags}>
          <Icon size="sm">
            <MdKeyboardArrowLeft />
          </Icon>
          タグ一覧に戻る
        </BasicButton>
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
