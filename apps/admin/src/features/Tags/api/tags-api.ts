import { tagsApiBase } from '@repo/ui/api';
import {
  FindAllCharactersResponse,
  FindAllPopularWordsResponse,
  FindAllTagsResponse,
} from '@repo/ui/api';

import { apiClient } from '@/lib/api/api-client';

import { CreateTagRequest, UpdateTagRequest } from './tags-api-types';

export class TagsApi {
  private endpointCharacters = '/characters';
  private endpointTags = '/tags';
  private endpointPopularWords = '/popular-words';

  private tagsApiBase = tagsApiBase;
  private apiClient = apiClient;

  /** キャラクター一覧を取得する */
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    return await this.tagsApiBase.findAllCharacters();
  }

  /** タグ一覧を取得する */
  async findAllTags(): Promise<FindAllTagsResponse> {
    return await this.tagsApiBase.findAllTags();
  }

  /** タグを登録する */
  async createTag(request: CreateTagRequest): Promise<void> {
    await apiClient.post(this.endpointTags, request);
  }

  /** タグを更新する */
  async updateTag(request: UpdateTagRequest): Promise<void> {
    await apiClient.put(`${this.endpointTags}/${request.id}`, request.form);
  }

  /** 語録一覧を取得する */
  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    return await this.tagsApiBase.findAllPopularWords();
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
