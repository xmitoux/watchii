import { fetchData } from '../../utils/fetchData';

import {
  FindAllCharactersResponse,
  FindAllPopularWordSpeakersResponse,
  FindAllPopularWordsResponse,
  FindAllTagsResponse,
} from './tags-api-types';

export class TagsApiBase {
  private endpointCharacters = '/characters';
  private endpointTags = '/tags';
  private endpointPopularWords = '/popular-words';

  /** キャラクター一覧を取得する */
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    const url = this.endpointCharacters;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクター一覧取得に失敗しました。');
    }

    return await res.json();
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

  /** 語録一覧を取得する */
  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    const url = this.endpointPopularWords;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('語録一覧取得に失敗しました。');
    }

    return await res.json();
  }

  /** 語録発言キャラ一覧を取得する */
  async findAllPopularWordSpeakers(): Promise<FindAllPopularWordSpeakersResponse> {
    const url = `${this.endpointPopularWords}/find-all-popular-word-speakers`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('語録一覧取得に失敗しました。');
    }

    return await res.json();
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApiBase = new TagsApiBase();
