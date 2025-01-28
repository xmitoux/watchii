import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

type UseInfiniteScrollOptions = {
  limit?: number;
  sortOrder?: string;
  baseUrl: string;
};

export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions,
) {
  const {
    limit = 12,
    sortOrder = 'desc',
    baseUrl,
  } = options;

  // キー生成関数
  const getKey = (pageIndex: number, previousPageData: T | null) => {
    // previousDataのpostsやepisodesの長さをチェック
    const dataArray = previousPageData ? Object.values(previousPageData).find(element => Array.isArray(element)) : null;
    if (previousPageData && dataArray && dataArray.length < limit) {
      return null;
    }
    const offset = pageIndex * limit;
    return `${baseUrl}?limit=${limit}&offset=${offset}&sort=${sortOrder}`;
  };

  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const {
    data,
    error,
    size,
    setSize,
    isLoading,
  } = useSWRInfinite<T>(getKey, fetcher);

  // Intersection Observer用のコールバック
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry!.isIntersecting && !isLoading) {
        setSize(prev => prev + 1);
      }
    },
    [isLoading, setSize],
  );

  // 監視対象要素用のref
  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) { return; }

      const observer = new IntersectionObserver(handleObserver, {
        rootMargin: '100px',
      });

      observer.observe(node);
      return () => observer.disconnect();
    },
    [handleObserver],
  );

  // データ配列を見つける関数
  const findDataArray = (page: Record<string, unknown>) => {
    const arrayValue = Object.values(page).find(element => Array.isArray(element));
    return arrayValue ?? [];
  };

  // ページネーション関連の計算
  const lastPage = data?.[data.length - 1];
  const isReachingEnd = lastPage && findDataArray(lastPage).length < limit;
  const isLoadingMore = isLoading || (size > 0 && data && data[size - 1] === undefined && !isReachingEnd);
  const total = data?.[0] && typeof data[0] === 'object' ? ('total' in data[0] ? (data[0] as { total: number }).total : 0) : 0;

  return {
    data,
    error,
    setSize,
    isLoading,
    isLoadingMore,
    observerRef,
    total,
  };
}
