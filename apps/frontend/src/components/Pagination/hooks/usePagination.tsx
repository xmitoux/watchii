import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export type UsePaginationProps = {
  currentPage: number;
  destinationPage: string;
};

/**
 * ページネーションのカスタムフック
 * @param currentPage 現在のページ番号
 * @param destinationPage 遷移先のページ
 */
export const usePagination = ({ currentPage, destinationPage }: UsePaginationProps) => {
  const router = useRouter();

  // スクロールコンテナへの参照を作成(Layoutコンポーネントに渡してコンテンツ部分をスクロールさせる)
  const scrollRef = useRef<HTMLDivElement>(null);

  // currentPageが変わるたびにスクロールする
  useEffect(() => {
    if (scrollRef.current) {
      // スクロールコンテナをトップにスクロール
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  function pagination(page: number) {
    router.push(`${destinationPage}/${page}`);
  }

  return { scrollRef, pagination };
};
