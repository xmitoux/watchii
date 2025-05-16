import { apiClient } from '@/lib/api/api-client';

import { VerifyAdminUserResponse } from './users-api-types';

export class UsersApi {
  private apiClient = apiClient;
  private endpoint = '/users';

  /** 管理者の検証 */
  async verifyAdminUser(token: string): Promise<void> {
    await this.apiClient.post<VerifyAdminUserResponse>(`${this.endpoint}/verify-admin-user`, null, token);
  }
}

export const usersApi = new UsersApi();
