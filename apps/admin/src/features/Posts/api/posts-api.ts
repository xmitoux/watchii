import { FindAllPostsRequest, FindAllPostsResponse, postsApiBase } from '@repo/ui/api';

import { apiClient } from '@/lib/api/api-client';

export class PostsApi {
  private postsApiBase = postsApiBase;
  private apiClient = apiClient;

  /** Post一覧を取得する */
  async findAllPosts(request: FindAllPostsRequest): Promise<FindAllPostsResponse> {
    return await this.postsApiBase.findAllPosts(request);
  }
}

export const postsApi = new PostsApi();
