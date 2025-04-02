import { fetchData } from '@/utils/fetch';

import { EpisodeFindAllResponse } from '../types/episodes-types';

const endpoint = `/episodes`;

type GetEpisodePagesByCategoryRequest = {
  category: number;
};

type GetEpisodePagesByCategoryResponse = {
  total: number;
};

/** エピソードカテゴリの総ページ数を取得する */
export async function getEpisodePagesByCategory(
  { category }: GetEpisodePagesByCategoryRequest,
): Promise<number> {
  const apiUrl = `${endpoint}?limit=1&category=${category}`;
  const res = await fetchData(apiUrl);

  if (!res.ok) {
    throw new Error('エピソードカテゴリの総ページ数取得処理に失敗しました。');
  }

  const data: GetEpisodePagesByCategoryResponse = await res.json();
  return data.total;
}

type GetEpisodesByCategoryRequest = {
  category: number;
  perPage: number;
  offset: number;
};

type GetEpisodesByCategoryResponse = EpisodeFindAllResponse;

/** カテゴリごとのエピソード一覧を取得する */
export async function getEpisodesByCategory(
  { category, perPage, offset }: GetEpisodesByCategoryRequest,
): Promise<GetEpisodesByCategoryResponse> {
  const apiUrl = `${endpoint}?category=${category}&limit=${perPage}&offset=${offset}`;
  const res = await fetchData(apiUrl);

  if (!res.ok) {
    throw new Error('カテゴリごとのエピソード一覧取得処理に失敗しました。');
  }

  const data = await res.json();
  return data;
}
