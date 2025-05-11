import useSWR from 'swr';

import { usersApi } from '@/features/Signup/api/users-api';

import { useSessionToken } from './useSessionToken';

/** お気に入り機能用のカスタムフック */
export function useUserFavs() {
  const { getSessionToken } = useSessionToken();

  // お気に入りデータ取得用のfetcher
  const fetcher = async () => {
    const token = await getSessionToken();
    if (!token) {
      return;
    }

    const response = await usersApi.getUserFavs(token);
    return response;
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR('favs', fetcher);

  // お気に入りチェック
  const isFav = (postId: number) => {
    if (!data) {
      return false;
    }
    return data.posts.some((post) => post.id === postId);
  };

  return {
    favPosts: data?.posts || [],
    isFavLoading: isLoading,
    isFavValidating: isValidating,
    isError: error,
    isFav,
    mutate, // 状態更新用
  };
}
