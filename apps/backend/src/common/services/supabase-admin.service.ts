import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAdminService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceRoleKey) {
      this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    }
    else {
      throw new Error('Supabase Admin用の環境変数が設定されていません。'
        + '<SUPABASE_URL>, <SUPABASE_SERVICE_ROLE_KEY>を確認してください。');
    }
  }

  /**
   * Supabaseからユーザーを削除
   * @param userId - 削除対象のユーザーID
   */
  async deleteUser(userId: string) {
    try {
      const { error } = await this.supabase.auth.admin.deleteUser(userId);

      if (error) {
        throw error;
      }

      return true;
    }
    catch (error) {
      throw new Error(`Delete user failed: ${error.message}`);
    }
  }
}
