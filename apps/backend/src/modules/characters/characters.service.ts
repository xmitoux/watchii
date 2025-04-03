import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';

import { FindAllCharactersResponse, FindPostsByCharacterResponse, GetCharactersPostCountResponse } from './entities/characters.entity';

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  private readonly logger = new Logger(CharactersService.name);

  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    const characters = await this.prisma.character.findMany({
      select: {
        id: true,
        name: true,
        nameKey: true,
        iconFilename: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return {
      characters,
    };
  }

  async getCharactersPostCount(): Promise<GetCharactersPostCountResponse> {
    // キャラクターを取得し、それぞれの投稿数も含める
    const characters = await this.prisma.character.findMany({
      include: {
        posts: true,
      },
    });

    // 各キャラクターの投稿数を計算して返す
    return characters.map((character) => ({
      nameKey: character.nameKey,
      postCount: character.posts.length,
    }));
  }

  async findPostsByCharacter(nameKey: string, query: PaginationParams): Promise<FindPostsByCharacterResponse> {
    const {
      limit = 12,
      offset = 0,
      sort = 'asc',
    } = query;

    // キャラクターでフィルタリングする条件
    const whereCondition = {
      characters: {
        some: {
          nameKey,
        },
      },
    };

    // キャラクター条件で全体の件数を取得
    const total = await this.prisma.post.count({
      where: whereCondition,
    });

    // キャラクター条件で投稿を取得
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

    // キャラクター名を取得
    const character = await this.prisma.character.findUnique({
      where: {
        nameKey,
      },
      select: {
        name: true,
      },
    });

    return {
      characterName: character?.name || '',
      posts,
      total,
    };
  }
}
