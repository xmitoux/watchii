import { fetchData } from '../../utils/fetchData';

import { FindAllPostsRequest, FindAllPostsResponse } from './posts-api-types';

export class PostsApiBase {
  private endpoint = '/posts';

  /** Post一覧を取得する */
  async findAllPosts(request: FindAllPostsRequest): Promise<FindAllPostsResponse> {
    const url = `${this.endpoint}?limit=${request.limit}&offset=${request.offset}`;

    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('Post一覧取得に失敗しました。');
    }

    return await res.json();
  }
}

export const postsApiBase = new PostsApiBase();
