import { fetchData } from '@/utils/fetch';

import {
  FindAllCharactersResponse,
  FindAllTagsResponse,
  FindPostsByCharacterRequest,
  FindPostsByCharacterResponse,
  FindPostsByTagRequest,
  FindPostsByTagResponse,
  GetCharactersPostCountResponse,
  GetTagsPostCountResponse,
} from './tags-api-types';

export class TagsApi {
  private endpointCharacters = '/characters';
  private endpointTags = '/tags';

  /** キャラクター一覧を取得する */
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

  /** タグ一覧を取得する */
  async findAllTags(): Promise<FindAllTagsResponse> {
    const url = this.endpointTags;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('タグ一覧取得に失敗しました。');
    }

    return await res.json();
  }

  /** タグごとのPost数を取得する */
  async getTagsPostCount(): Promise<GetTagsPostCountResponse> {
    const url = `${this.endpointTags}/get-tags-post-count`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('タグごとのPost数取得に失敗しました。');
    }

    const data = await res.json();
    return data;
  }

  /** タグのPost一覧を取得する */
  async findPostsByTag(
    { id, perPage, offset }: FindPostsByTagRequest,
  ): Promise<FindPostsByTagResponse> {
    const url = `${this.endpointTags}/find-posts-by-tag/${id}?limit=${perPage}&offset=${offset}`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('タグごとのPost一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
