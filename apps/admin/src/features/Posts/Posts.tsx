import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/components/PostGallery';

import { PostsProps } from './types/posts-types';

export default function Posts({ posts, total, currentPage, perPage }: PostsProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // ページ遷移時にスクロール位置を保存する
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // スクロール制御対象の要素
      const element = scrollRef?.current;
      if (!element) {
        return;
      }
      // スクロール位置を保存
      sessionStorage.setItem('scrollPos', element.scrollTop.toString() ?? '0');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  // マウント時にスクロール位置を復元する
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // 少し遅延させて復元（レンダリングが完了してから）
    const timer = setTimeout(() => {
      const savedPosition = sessionStorage.getItem('scrollPos');
      element.scrollTop = savedPosition ? Number(savedPosition) : 0;
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/posts/page',
  });

  return (
    <Layout title="Post一覧" scrollRef={scrollRef}>
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
