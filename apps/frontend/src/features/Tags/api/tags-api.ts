import { fetchData } from '@/utils/fetch';

import {
  FindAllCharactersResponse,
  FindPostsByCharacterRequest,
  FindPostsByCharacterResponse,
  GetCharactersPostCountResponse,
} from './tags-api-types';

export class TagsApi {
  private endpointCharacters: string = '/characters';

  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    const url = this.endpointCharacters;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクター一覧取得に失敗しました。');
    }

    return await res.json();
  }

  /** キャラクターごとのPost数を取得する */
  async getCharactersPostCount(): Promise<GetCharactersPostCountResponse> {
    const url = `${this.endpointCharacters}/get-characters-post-count`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクターごとのPost数取得に失敗しました。');
    }

    const data = await res.json();
    return data;
  }

  /** キャラクターのPost一覧を取得する */
  async findPostsByCharacter(
    { nameKey, perPage, offset }: FindPostsByCharacterRequest,
  ): Promise<FindPostsByCharacterResponse> {
    const url = `${this.endpointCharacters}/find-posts-by-character/${nameKey}?limit=${perPage}&offset=${offset}`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクターごとのPost一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
