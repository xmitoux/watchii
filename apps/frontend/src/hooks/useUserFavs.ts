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
      // 未ログイン時は空配列を返す
      return [];
    }

    const response = await usersApi.getUserFavs(token);
    return response;
  };

  // useSWRでデータ取得＆キャッシュ
  const { data, error, mutate } = useSWR('favs', fetcher);

  // お気に入りチェック
  const isFav = (postId: number) => {
    if (!data) {
      return false;
    }
    return data.some((fav) => fav.postId === postId);
  };

  return {
    favs: data || [],
    isFavLoading: !error && !data,
    isError: error,
    isFav,
    mutate, // 状態更新用
  };
}
