import { fetchData } from '@repo/ui/utils';

import { FindPostResponse } from './posts-api-types';

export class PostsApi {
  private endpointPosts = '/posts'

  /** Post詳細を取得する */
  async findPost(id: number): Promise<FindPostResponse> {
    const url = `${this.endpointPosts}/${id}`;
    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('Post詳細取得に失敗しました。');
    }

    return await res.json();
  }
}

export const postsApi = new PostsApi();
