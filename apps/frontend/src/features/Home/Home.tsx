import { useEffect } from 'react';

import { Center } from '@repo/ui/chakra-ui';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { PostGallery } from '@/features/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationStore } from '@/stores/navigationStore';

import { HomeProps } from './types/home-types';

export default function Home({ posts, total, currentPage, perPage }: HomeProps) {
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/home/page',
    scrollRef,
  });

  const { homeState, setHomeScrollPosition, setHomeCurrentPage } = useNavigationStore();

  // レンダリング時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // スクロール位置を復元
    requestAnimationFrame(() => {
      element.scrollTop = homeState.scrollPosition;
    });

    // スクロール位置のストア保存処理をスクロールイベントに登録
    const saveScrollPosition = () => {
      const scroll = element.scrollTop ?? 0;
      setHomeScrollPosition(scroll);
    };
    element.addEventListener('scroll', saveScrollPosition);

    // クリーンアップ
    return () => {
      element.removeEventListener('scroll', saveScrollPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPageChange(page: number) {
    // ページ遷移時にページ番号をストアに保存
    setHomeCurrentPage(page);
    pagination(page);
  }

  return (
    <Layout title="Watchii" scrollRef={scrollRef}>
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* ページネーション */}
      <Center mt={4}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </Center>
    </Layout>
  );
}
