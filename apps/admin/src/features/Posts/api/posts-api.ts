import { FindAllPostsRequest, FindAllPostsResponse, postsApiBase } from '@repo/ui/api';
import { fetchData } from '@repo/ui/utils';

import { apiClient } from '@/lib/api/api-client';

import { FindPostResponse, UpdatePostCharactersRequest, UpdatePostPopularWordsRequest, UpdatePostTagsRequest } from './posts-api-types';

export class PostsApi {
  private postsApiBase = postsApiBase;
  private apiClient = apiClient;
  private endpointPosts = '/posts';

  /** Post一覧を取得する */
  async findAllPosts(request: FindAllPostsRequest): Promise<FindAllPostsResponse> {
    return await this.postsApiBase.findAllPosts(request);
  }

  /** Post詳細を取得する */
  async findPost(id: number): Promise<FindPostResponse> {
    const url = `${this.endpointPosts}/${id}`;
    const res = await fetchData(url);

    if (!res.ok) {
      throw new Error('Post詳細取得に失敗しました。');
    }

    return await res.json();
  }

  /** Postのキャラを更新する */
  async updatePostCharacters(request: UpdatePostCharactersRequest): Promise<void> {
    await this.apiClient.patch(`${this.endpointPosts}/update-post-characters`, request);
  }

  /** Postのタグを更新する */
  async updatePostTags(request: UpdatePostTagsRequest): Promise<void> {
    await this.apiClient.patch(`${this.endpointPosts}/update-post-tags`, request);
  }

  /** Postの語録を更新する */
  async updatePostPopularWords(request: UpdatePostPopularWordsRequest): Promise<void> {
    await this.apiClient.patch(`${this.endpointPosts}/update-post-popular-words`, request);
  }
}

export const postsApi = new PostsApi();
