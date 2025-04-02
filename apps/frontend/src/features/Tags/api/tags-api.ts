import { fetchData } from '@/utils/fetch';

import {
  FindAllCharactersResponse,
} from '../types/tags-types';

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
}

// 使いやすいようにシングルトンインスタンスをエクスポート
export const tagsApi = new TagsApi();
