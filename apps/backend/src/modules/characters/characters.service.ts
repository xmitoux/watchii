import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';

import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dto/character.dto';
import { FindAllCharactersResponse, FindCharacterResponse, FindPostsByCharacterResponse, GetCharactersPostCountResponse } from './entities/characters.entity';

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  private readonly logger = new Logger(CharactersService.name);

  private getIconFilename(nameKey: string): string {
    return `chara-icon-${nameKey}.webp`;
  }

  /** キャラクターを登録する */
  async create(dto: CreateCharacterRequestDto): Promise<void> {
    const iconFilename = this.getIconFilename(dto.nameKey);

    await this.prisma.character.create({
      data: {
        name: dto.name,
        nameKey: dto.nameKey,
        order: Number(dto.order),
        iconFilename,
      },
    });
  }

  async findAllCharacters(all: boolean = true): Promise<FindAllCharactersResponse> {
    const characters = await this.prisma.character.findMany({
      select: {
        id: true,
        name: true,
        nameKey: true,
        iconFilename: true,
      },
      where: all
        ? {}
        : {
          // Postがないキャラクターを除外
          posts: {
            some: {},
          },
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

  /** キャラを取得 */
  async findCharacter(nameKey: string): Promise<FindCharacterResponse> {
    const character = await this.prisma.character.findUnique({
      where: { nameKey },
      select: {
        id: true,
        name: true,
        nameKey: true,
        order: true,
      },
    });

    return { character };
  }

  /** キャラクターを更新する */
  async update(id: number, dto: UpdateCharacterRequestDto): Promise<void> {
    const iconFilename = this.getIconFilename(dto.nameKey);

    await this.prisma.character.update({
      where: { id },
      data: {
        name: dto.name,
        nameKey: dto.nameKey,
        order: Number(dto.order),
        iconFilename,
      },
    });
  }
}
