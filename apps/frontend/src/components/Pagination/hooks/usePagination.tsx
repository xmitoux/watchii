import { useRouter } from 'next/router';
import { RefObject, useEffect } from 'react';

export type UsePaginationProps = {
  currentPage: number;
  destinationPage: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

/**
 * ページネーションのカスタムフック
 * @param currentPage 現在のページ番号
 * @param destinationPage 遷移先のページ
 */
export const usePagination = ({ currentPage, destinationPage, scrollRef }: UsePaginationProps) => {
  const router = useRouter();

  // currentPageが変わるたびにスクロールする
  useEffect(() => {
    if (scrollRef?.current) {
      // スクロールコンテナをトップにスクロール
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  function pagination(page: number) {
    router.push(`${destinationPage}/${page}`);
  }

  return { pagination };
};
