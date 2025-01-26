import { Injectable } from '@nestjs/common';

import { FileUploadService } from '@/common/services/file-upload.service';
import { PrismaService } from '@/common/services/prisma.service';

import { PostsFindAllRequestDto } from './dto/posts.dto';
import { PostFindAllResponseEntity } from './entities/post.entity';

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

  async findAll(query: PostsFindAllRequestDto = {}): Promise<PostFindAllResponseEntity> {
    const {
      limit = 12,
      offset = 0,
      sort = 'desc',
    } = query;

    // 全体の件数を取得
    const total = await this.prisma.post.count();

    // 指定された条件で投稿を取得
    const posts = await this.prisma.post.findMany({
      orderBy: {
        postedAt: sort,
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        imageUrl: true,
        postedAt: true,
      },
    });

    return {
      posts,
      total,
    };
  }
}
