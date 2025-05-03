import { apiClient } from '@/lib/api/api-client';

import { GetUserFavsResponse, RegisterUserRequest, RegisterUserResponse, ToggleUserFavsRequest } from './users-api-types';

export class UsersApi {
  private apiClient = apiClient;
  private endpoint = '/users';

  /** ユーザ登録を行う */
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return this.apiClient.post(this.endpoint, request);
  }

  /** ユーザのお気に入り一覧を取得する */
  async getUserFavs(token: string): Promise<GetUserFavsResponse> {
    return this.apiClient.get(`${this.endpoint}/get-user-favs`, token);
  }

  /** ユーザのお気に入りをトグルする */
  async toggleUserFavs(request: ToggleUserFavsRequest, token: string): Promise<void> {
    return this.apiClient.post(`${this.endpoint}/toggle-user-favs`, request, token);
  }

  /** ユーザを削除する */
  async deleteUser(token: string): Promise<void> {
    return this.apiClient.delete(`${this.endpoint}`, token);
  }
}

export const usersApi = new UsersApi();
