import { useCallback, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

type UseInfiniteScrollOptions = {
  limit?: number;
  sortOrder?: string;
  baseUrl: string;
  queryString?: string;
  threshold?: number; // スクロールのトリガー位置
  preloadPages?: number; // 先読みするページ数
};

export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions,
) {
  const {
    limit = 12,
    sortOrder = 'desc',
    baseUrl,
    queryString,
    threshold = 0.7, // デフォルトで70%位置でトリガー
    preloadPages = 1, // デフォルトで1ページ先読み
  } = options;

  // 先読み状態管理用
  const preloadedPagesRef = useRef<Set<number>>(new Set());

  // キー生成関数
  const getKey = (pageIndex: number, previousPageData: T | null) => {
    const dataArray = previousPageData ? Object.values(previousPageData).find(element => Array.isArray(element)) : null;
    if (previousPageData && dataArray && dataArray.length < limit) {
      return null;
    }
    const offset = pageIndex * limit;
    return `${baseUrl}?${queryString ? `${queryString}&` : ''}limit=${limit}&offset=${offset}&sort=${sortOrder}`;
  };

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    // 現在のページ番号を計算
    const offset = url.match(/offset=(\d+)/)?.[1];
    const pageNumber = offset ? Number.parseInt(offset) / limit : 0;

    // プリフェッチの実行
    if (!preloadedPagesRef.current.has(pageNumber + 1)) {
      const nextPages = Array.from({ length: preloadPages }, (_, i) => pageNumber + i + 1);

      // 並行で次のページをプリフェッチ
      Promise.all(
        nextPages.map(async (page) => {
          const offset = page * limit;
          const nextUrl = `${baseUrl}?${queryString ? `${queryString}&` : ''}limit=${limit}&offset=${offset}&sort=${sortOrder}`;

          try {
            // プリフェッチリクエスト
            const prefetchResponse = await fetch(nextUrl);
            if (prefetchResponse.ok) {
              preloadedPagesRef.current.add(page);
            }
          }
          catch (error) {
            console.warn('Prefetch failed:', error);
          }
        }),
      );
    }

    return data;
  };

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
      if (entry?.isIntersecting && !isLoading) {
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
        root: null,
        rootMargin: '200px', // 検出範囲を広げる
        threshold,
      });

      observer.observe(node);
      return () => observer.disconnect();
    },
    [handleObserver, threshold],
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

  // コンポーネントのアンマウント時にプリフェッチ状態をリセット
  useEffect(() => {
    return () => {
      preloadedPagesRef.current.clear();
    };
  }, []);

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
