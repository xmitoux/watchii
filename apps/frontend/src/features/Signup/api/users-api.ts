import { apiClient } from '@/lib/api/api-client';

import { GetUserFavsResponse, RegisterUserRequest, RegisterUserResponse, SignInWithOAuthRequest, SignInWithOAuthResponse, ToggleUserFavsRequest } from './users-api-types';

export class UsersApi {
  private apiClient = apiClient;
  private endpoint = '/users';

  /** ユーザ登録を行う */
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return this.apiClient.post(this.endpoint, request);
  }

  /** OAuthログインを行う */
  async signInWithOAuth(request: SignInWithOAuthRequest): Promise<SignInWithOAuthResponse> {
    return this.apiClient.post(`${this.endpoint}/sign-in-with-oauth`, request);
  }

  /** ユーザのお気に入り一覧を取得する */
  async getUserFavs(token: string): Promise<GetUserFavsResponse> {
    return this.apiClient.get(`${this.endpoint}/get-user-favs`, token);
  }

  /** ユーザのお気に入りを追加する */
  async addUserFav(request: ToggleUserFavsRequest, token: string): Promise<void> {
    return this.apiClient.post(`${this.endpoint}/add-user-fav`, request, token);
  }

  /** ユーザのお気に入りを削除する */
  async removeUserFav(request: ToggleUserFavsRequest, token: string): Promise<void> {
    return this.apiClient.post(`${this.endpoint}/remove-user-fav`, request, token);
  }

  /** ユーザを削除する */
  async deleteUser(token: string): Promise<void> {
    return this.apiClient.delete(`${this.endpoint}`, token);
  }
}

export const usersApi = new UsersApi();
