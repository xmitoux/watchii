import { tagsApiBase } from '@repo/ui/api';
import {
  FindAllCharactersResponse,
  FindAllPopularWordSpeakersResponse,
  FindAllTagsResponse,
} from '@repo/ui/api';
import { fetchData } from '@repo/ui/utils';

import {
  FindPostsByCharacterRequest,
  FindPostsByCharacterResponse,
  FindPostsByPopularWordRequest,
  FindPostsByPopularWordResponse,
  FindPostsByTagRequest,
  FindPostsByTagResponse,
  GetCharactersPostCountResponse,
  GetPopularWordsPostCountResponse,
  GetTagsPostCountResponse,
} from './tags-api-types';

export class TagsApi {
  private endpointCharacters = '/characters';
  private endpointTags = '/tags';
  private endpointPopularWords = '/popular-words';

  private tagsApiBase = tagsApiBase;

  /** Postを持つキャラクター一覧を取得する */
  async findAllCharactersHaveSomePosts(): Promise<FindAllCharactersResponse> {
    const url = `${this.endpointCharacters}/find-all-characters-have-some-posts`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクター一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
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

  /** Postを持つタグ一覧を取得する */
  async findAllTagsHaveSomePosts(): Promise<FindAllTagsResponse> {
    const url = `${this.endpointTags}/find-all-tags-have-some-posts`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('タグ一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
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

  /** Postを持つ語録一覧を取得する */
  async findAllPopularWordSpeakersHaveSomePosts(): Promise<FindAllPopularWordSpeakersResponse> {
    const url = `${this.endpointPopularWords}/find-all-popular-word-speakers-have-some-posts`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('語録一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
  }

  /** 語録ごとのPost数を取得する */
  async getPopularWordsPostCount(): Promise<GetPopularWordsPostCountResponse> {
    const url = `${this.endpointPopularWords}/get-popular-words-post-count`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('語録ごとのPost数取得に失敗しました。');
    }

    const data = await res.json();
    return data;
  }

  /** 語録のPost一覧を取得する */
  async findPostsByPopularWord(
    { id, perPage, offset }: FindPostsByPopularWordRequest,
  ): Promise<FindPostsByPopularWordResponse> {
    const url = `${this.endpointPopularWords}/find-posts-by-popular-word/${id}?limit=${perPage}&offset=${offset}`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('語録ごとのPost一覧取得処理に失敗しました。');
    }

    const data = await res.json();
    return data;
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
