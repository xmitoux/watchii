import { apiClient } from '@/lib/api/api-client';

import { RegisterUserRequest, RegisterUserResponse } from './users-api-types';

export class UsersApi {
  private apiClient = apiClient;
  private endpoint = '/users';

  /** ユーザ登録を行う */
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return this.apiClient.post<RegisterUserResponse>(this.endpoint, request);
  }
}

export const usersApi = new UsersApi();
