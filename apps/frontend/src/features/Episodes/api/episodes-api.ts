import { EpisodeFindAllResponse } from '../types/episodes-types';

const apiBaseUrl = `${process.env.API_BASE_URL}/episodes`;

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
  const apiUrl = `${apiBaseUrl}?limit=1&category=${category}`;
  const res = await fetch(apiUrl);

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
  const apiUrl = `${apiBaseUrl}?category=${category}&limit=${perPage}&offset=${offset}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    throw new Error('カテゴリごとのエピソード一覧取得処理に失敗しました。');
  }

  const data = await res.json();
  return data;
}
