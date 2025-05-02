import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseBucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabaseBucket = process.env.SUPABASE_BUCKET;

    if (supabaseUrl && supabaseKey && supabaseBucket) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.supabaseBucket = supabaseBucket;
    }
    else {
      throw new Error('Supabase用の環境変数が設定されていません。'
        + '<SUPABASE_URL>, <SUPABASE_KEY>, <SUPABASE_BUCKET>を確認してください。');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.supabaseBucket)
        .upload(file.originalname, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
          cacheControl: '31536000', // 1年間キャッシュ
        });

      if (!data || error) {
        throw error;
      }

      return data.path;
    }
    catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFiles(paths: string[]) {
    try {
      const { error } = await this.supabase.storage
        .from(this.supabaseBucket)
        .remove(paths);

      if (error) {
        throw error;
      }

      return true;
    }
    catch (error) {
      throw new Error(`Files deletion failed: ${error.message}`);
    }
  }

  /**
   * ユーザ登録の検証
   * @param token - 検証に使用するトークン(登録確認メールのトークン)
   * @returns ユーザ登録の検証結果(ユーザデータ・セッション情報)
   */

  async verifyUserRegistration(token: string) {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: token, type: 'email' });

      if (error) {
        throw error;
      }

      return data;
    }
    catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async getUser(bearerToken: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(bearerToken.replace('Bearer ', ''));

      if (error) {
        throw error;
      }

      return data.user;
    }
    catch (error) {
      throw new Error(`Get user failed: ${error.message}`);
    }
  }
}
