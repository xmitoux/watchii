import { useRouter } from 'next/router';
import { RefObject, useCallback, useEffect } from 'react';

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

  // プリフェッチ処理
  const prefetchPages = useCallback(() => {
    // 現在のページの前後のページをプリフェッチ
    if (currentPage > 1) {
      router.prefetch(`${destinationPage}/${currentPage - 1}`);
    }
    router.prefetch(`${destinationPage}/${currentPage + 1}`);
  }, [currentPage, destinationPage, router]);

  useEffect(() => {
    prefetchPages();
  }, [prefetchPages]);

  // currentPageが変わるたびにスクロールする
  useEffect(() => {
    if (scrollRef?.current) {
      // スクロールコンテナをトップにスクロール
      // (ページ遷移前に、現在ページの先頭まで一瞬スクロールしてしまうのでちょっと待つ)
      setTimeout(() => {
        scrollRef!.current!.scrollTo({ top: 0 });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  async function pagination(page: number) {
    // 遷移前に次のページをプリフェッチ
    await router.prefetch(`${destinationPage}/${page}`);
    router.push(`${destinationPage}/${page}`);
  }

  return { pagination };
};
