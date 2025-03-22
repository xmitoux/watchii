import { AnimatePresence } from 'motion/react';

import { Box, Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';

import { usePWAInstallGuide } from './hooks/usePWAInstallGuide';
import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/home/page',
    scrollRef,
  });

  useNavigationRestore('home', scrollRef);

  const {
    isPWA,
    showPWAGuide,
    PWSGuideButton,
    PWAInstallGuide,
  } = usePWAInstallGuide();

  return (
    <>
      <AnimatePresence mode="wait">
        {showPWAGuide && (
          <PWAInstallGuide />
        )}
      </AnimatePresence>

      {/* ガイドが表示されていてもレイアウトは常に存在 (ただしz-indexで下に) */}
      <Box
        style={{
          filter: showPWAGuide ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        }}
      >
        <Layout
          title="Watchii"
          scrollRef={scrollRef}
          actionButton={!isPWA() ? <PWSGuideButton /> : undefined}

        >
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
      </Box>
    </>
  );
}
