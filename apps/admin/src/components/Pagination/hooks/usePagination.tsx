import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

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

  async function pagination(page: number) {
    // 遷移前に次のページをプリフェッチ
    await router.prefetch(`${destinationPage}/${page}`);
    router.push(`${destinationPage}/${page}`);
  }

  return { pagination };
};
