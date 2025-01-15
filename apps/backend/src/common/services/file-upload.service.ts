import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FileUploadService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    else {
      throw new Error('Supabase用の環境変数が設定されていません。'
        + '<SUPABASE_URL>と<SUPABASE_KEY>を確認してください。');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    folder?: string,
  ) {
    try {
      const fileName = `${folder ? `${folder}/` : ''}${Date.now()}-${file.originalname}`;

      const { error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    }
    catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}
