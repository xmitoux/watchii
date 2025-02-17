import { useCallback } from 'react';
import useSWR from 'swr';

export interface UsePaginationProps {
  baseUrl: string;
  page: number;
  limit: number;
  sortOrder?: 'asc' | 'desc';
}

export interface UsePaginationReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  totalPages: number;
}

export function usePagination<T extends { total: number }>({
  baseUrl,
  page,
  limit,
  sortOrder = 'desc',
}: UsePaginationProps): UsePaginationReturn<T> {
  // offset計算
  const offset = (page - 1) * limit;

  // キーの生成
  const createKey = useCallback(() => {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      sort: sortOrder,
    });
    return `${baseUrl}?${params.toString()}`;
  }, [baseUrl, limit, offset, sortOrder]);

  // SWRを使用してデータフェッチ
  const { data: responseData, error } = useSWR<T>(createKey());

  return {
    data: responseData ?? null, // undefinedの場合はnullに変換
    error: error ?? null, // undefinedの場合はnullに変換
    isLoading: !error && !responseData,
    totalPages: responseData ? Math.ceil(responseData.total / limit) : 0,
  };
}
