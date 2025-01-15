import { Injectable } from '@nestjs/common';

import { FileUploadService } from '@/common/services/file-upload.service';
import { PrismaService } from '@/common/services/prisma.service';

import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async create(files: Express.Multer.File[], postedAtList: string[]) {
    try {
      if (files.length !== postedAtList.length) {
        // ファイル数と投稿日時リストの数は同じでなければならない
        throw new Error('Files and postedAt times must have the same length');
      }

      const posts = await Promise.all(
        files.map(async (file, index) => {
          // Supabaseに画像をアップロード
          const bucket = 'post-images';
          const uploadedFileURL = await this.fileUploadService.uploadFile(file, bucket);

          // DBに画像URLとpostedAtを登録
          return this.prisma.post.create({
            data: {
              imageUrl: uploadedFileURL,
              postedAt: new Date(postedAtList[index]),
            },
          });
        }),
      );

      return posts;
    }
    catch (error) {
      throw new Error(`Failed to create posts: ${error.message}`);
    }
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        postedAt: 'desc',
      },
    });
  }
}
