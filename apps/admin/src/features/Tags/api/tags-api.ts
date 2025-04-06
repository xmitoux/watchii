import { tagsApiBase } from '@repo/ui/api';
import {
  FindAllCharactersResponse,
  FindAllPopularWordsResponse,
  FindAllTagsResponse,
} from '@repo/ui/api';

export class TagsApi {
  private endpointCharacters = '/characters';
  private endpointTags = '/tags';
  private endpointPopularWords = '/popular-words';

  private tagsApiBase = tagsApiBase;

  /** キャラクター一覧を取得する */
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    return await this.tagsApiBase.findAllCharacters();
  }

  /** タグ一覧を取得する */
  async findAllTags(): Promise<FindAllTagsResponse> {
    return await this.tagsApiBase.findAllTags();
  }

  /** 語録一覧を取得する */
  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    return await this.tagsApiBase.findAllPopularWords();
  }
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
