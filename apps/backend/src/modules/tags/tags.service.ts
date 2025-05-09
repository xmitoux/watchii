import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';

import { CreateTagRequestDto, UpdateTagRequestDto } from './dto/tags.dto';
import { FindAllTagsResponse, FindPostsByTagResponse, FindTagResponse, GetTagsPostCountResponse } from './entities/tags.entity';

@Injectable()
export class TagsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  private readonly logger = new Logger(TagsService.name);

  async findAllTags(all: boolean = true): Promise<FindAllTagsResponse> {
    const tags = await this.prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      where: all
        ? {}
        : {
          // Postがないタグを除外
          posts: {
            some: {},
          },
        },
      orderBy: {
        kana: 'asc',
      },
    });

    return {
      tags,
    };
  }

  async getTagsPostCount(): Promise<GetTagsPostCountResponse> {
    // タグを取得し、それぞれの投稿数も含める
    const tags = await this.prisma.tag.findMany({
      include: {
        posts: true,
      },
    });

    // 各タグの投稿数を計算して返す
    return tags.map((tag) => ({
      id: tag.id,
      postCount: tag.posts.length,
    }));
  }

  async findPostsByTag(id: number, query: PaginationParams): Promise<FindPostsByTagResponse> {
    const {
      limit = 12,
      offset = 0,
      sort = 'asc',
    } = query;

    // タグでフィルタリングする条件
    const whereCondition = {
      tags: {
        some: {
          id,
        },
      },
    };

    // タグ条件で全体の件数を取得
    const total = await this.prisma.post.count({
      where: whereCondition,
    });

    // タグ条件で投稿を取得
    const posts = await this.prisma.post.findMany({
      select: {
        id: true,
        filename: true,
        postedAt: true,
        characters: {
          select: {
            name: true,
          },
        },
      },
      where: whereCondition,
      orderBy: {
        postedAt: sort,
      },
      take: limit,
      skip: offset,
    });

    // タグ名を取得
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });

    return {
      tagName: tag?.name || '',
      posts,
      total,
    };
  }

  /** タグを取得 */
  async findTag(id: number): Promise<FindTagResponse> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        kana: true,
      },
    });

    return { tag };
  }

  /** タグを作成 */
  async create(createTagDto: CreateTagRequestDto) {
    return this.prisma.tag.create({
      data: {
        name: createTagDto.name,
        kana: createTagDto.kana,
      },
    });
  }

  /** タグを更新 */
  async update(id: number, updateTagDto: UpdateTagRequestDto) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        name: updateTagDto.name,
        kana: updateTagDto.kana,
      },
    });
  }
}
