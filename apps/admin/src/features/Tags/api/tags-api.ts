import { FindAllPopularWordsResponse, tagsApiBase } from '@repo/ui/api';
import {
  FindAllCharactersResponse,
  FindAllPopularWordSpeakersResponse,
  FindAllTagsResponse,
} from '@repo/ui/api';
import { fetchData } from '@repo/ui/utils';

import { apiClient } from '@/lib/api/api-client';

import {
  CreateCharacterRequest,
  CreatePopularWordRequest,
  CreateTagRequest,
  FindCharacterResponse as FindCharacterApiResponse,
  FindPopularWordResponse,
  FindTagResponse,
  UpdateCharacterRequest,
  UpdatePopularWordRequest,
  UpdateTagRequest,
} from './tags-api-types';

export class TagsApi {
  private tagsApiBase = tagsApiBase;
  private apiClient = apiClient;

  private endpointCharacters = '/characters';

  /** キャラ一覧を取得する */
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    return await this.tagsApiBase.findAllCharacters();
  }

  /** キャラを登録する */
  async createCharacter(request: CreateCharacterRequest): Promise<void> {
    await this.apiClient.post(this.endpointCharacters, request);
  }

  /** キャラ詳細を取得する */
  async findCharacter(nameKey: string): Promise<FindCharacterApiResponse> {
    const url = `${this.endpointCharacters}/${nameKey}`;
    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('キャラクター詳細取得に失敗しました。');
    }

    return await res.json();
  }

  /** キャラを更新する */
  async updateCharacter(request: UpdateCharacterRequest): Promise<void> {
    await this.apiClient.put(`${this.endpointCharacters}/${request.id}`, request.form);
  }

  private endpointTags = '/tags';

  /** タグ一覧を取得する */
  async findAllTags(): Promise<FindAllTagsResponse> {
    return await this.tagsApiBase.findAllTags();
  }

  /** タグを登録する */
  async createTag(request: CreateTagRequest): Promise<void> {
    await this.apiClient.post(this.endpointTags, request);
  }

  /** タグ詳細を取得する */
  async findTag(id: number): Promise<FindTagResponse> {
    const url = `${this.endpointTags}/${id}`;
    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('タグ詳細取得に失敗しました。');
    }

    return await res.json();
  }

  /** タグを更新する */
  async updateTag(request: UpdateTagRequest): Promise<void> {
    await this.apiClient.put(`${this.endpointTags}/${request.id}`, request.form);
  }

  private endpointPopularWords = '/popular-words';

  /** 語録一覧を取得する */
  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    return await this.tagsApiBase.findAllPopularWords();
  }

  /** 語録発言キャラ一覧を取得する */
  async findAllPopularWordSpeakers(): Promise<FindAllPopularWordSpeakersResponse> {
    return await this.tagsApiBase.findAllPopularWordSpeakers();
  }

  /** 語録を登録する */
  async createPopularWord(request: CreatePopularWordRequest): Promise<void> {
    await this.apiClient.post(this.endpointPopularWords, request);
  }

  /** 語録詳細を取得する */
  async findPopularWord(id: number): Promise<FindPopularWordResponse> {
    const url = `${this.endpointPopularWords}/${id}`;
    const res = await fetchData(url);
    if (!res.ok) {
      throw new Error('語録詳細取得に失敗しました。');
    }
    return await res.json();
  }

  /** 語録を更新する */
  async updatePopularWord(request: UpdatePopularWordRequest): Promise<void> {
    await this.apiClient.put(`${this.endpointPopularWords}/${request.id}`, request.form);
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
