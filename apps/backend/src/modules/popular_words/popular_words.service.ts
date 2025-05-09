import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';

import { CreatePopularWordRequestDto, UpdatePopularWordRequestDto } from './dto/popular_words.dto';
import { FindAllPopularWordSpeakersEntity, FindAllPopularWordSpeakersResponse, FindAllPopularWordsResponse, FindPopularWordResponse, FindPostsByPopularWordResponse, GetPopularWordsPostCountResponse } from './entities/popular_words.entity';

@Injectable()
export class PopularWordsService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new Logger(PopularWordsService.name);

  /** 語録を作成 */
  async createPopularWord(dto: CreatePopularWordRequestDto) {
    return this.prisma.popularWord.create({
      data: {
        word: dto.word,
        kana: dto.kana,
        speakerId: dto.speakerId,
      },
    });
  }

  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    const popularWords = await this.prisma.popularWord.findMany({
      select: {
        id: true,
        word: true,
        kana: true,
      },
      orderBy: [
        { kana: 'asc' },
        { id: 'asc' },
      ],
    });

    return {
      popularWords,
    };
  }

  async findAllPopularWordSpeakers(all: boolean = true): Promise<FindAllPopularWordSpeakersResponse> {
    // まず発言者情報も含めて全ての語録を取得
    const allPopularWords = await this.prisma.popularWord.findMany({
      select: {
        id: true,
        word: true,
        kana: true,
        speaker: {
          select: {
            id: true,
            name: true,
            iconFilename: true,
            order: true, // キャラクターのソート用
          },
        },
      },
      where: all
        ? {}
        : {
          // Postがない語録を除外
          posts: {
            some: {},
          },
        },
      orderBy: [
        {
          speaker: {
            order: 'asc', // 発言者の順番でまずソート
          },
        },
        {
          kana: 'asc', // 次に語録のかな順でソート
        },
      ],
    });

    // 発言者ごとにグループ化
    const speakerMap = new Map<number, FindAllPopularWordSpeakersEntity>();

    allPopularWords.forEach((word) => {
      const speakerId = word.speaker.id;

      if (!speakerMap.has(speakerId)) {
        // 新しい発言者のグループを作成
        speakerMap.set(speakerId, {
          speaker: {
            id: word.speaker.id,
            name: word.speaker.name,
            iconFilename: word.speaker.iconFilename,
            order: word.speaker.order,
          },
          words: [],
        });
      }

      // グループに語録を追加
      speakerMap.get(speakerId)!.words.push({
        id: word.id,
        word: word.word,
        kana: word.kana,
      });
    });

    // Map から配列に変換してキャラクターの順番でソート
    const groupedPopularWords = Array.from(speakerMap.values())
      .sort((a, b) => a.speaker.order - b.speaker.order);

    return {
      popularWordSpeakers: groupedPopularWords,
    };
  }

  async getPopularWordsPostCount(): Promise<GetPopularWordsPostCountResponse> {
    // 語録を取得し、それぞれの投稿数も含める
    const popularWords = await this.prisma.popularWord.findMany({
      include: {
        posts: true,
      },
    });

    // 各語録の投稿数を計算して返す
    return popularWords.map((popularWord) => ({
      id: popularWord.id,
      postCount: popularWord.posts.length,
    }));
  }

  async findPostsByPopularWord(id: number, query: PaginationParams): Promise<FindPostsByPopularWordResponse> {
    const {
      limit = 12,
      offset = 0,
      sort = 'asc',
    } = query;

    // 語録でフィルタリングする条件
    const whereCondition = {
      popularWords: {
        some: {
          id,
        },
      },
    };

    // 語録条件で全体の件数を取得
    const total = await this.prisma.post.count({
      where: whereCondition,
    });

    // 語録条件でPostを取得
    const posts = await this.prisma.post.findMany({
      select: {
        id: true,
        filename: true,
        postedAt: true,
      },
      where: whereCondition,
      orderBy: {
        postedAt: sort,
      },
      take: limit,
      skip: offset,
    });

    // 語録発言者のキャラクター情報を取得
    const popularWord = await this.prisma.popularWord.findUnique({
      where: {
        id,
      },
      select: {
        word: true,
        speaker: {
          select: {
            name: true,
            iconFilename: true,
          },
        },
      },
    });

    return {
      word: popularWord?.word || '',
      speakerName: popularWord?.speaker?.name || '',
      posts,
      total,
    };
  }

  /** 語録を取得 */
  async findPopularWord(id: number): Promise<FindPopularWordResponse> {
    const popularWord = await this.prisma.popularWord.findUnique({
      select: {
        id: true,
        word: true,
        kana: true,
        speaker: {
          select: {
            id: true,
            name: true,
            iconFilename: true,
          },
        },
      },
      where: { id },
    });

    return { popularWord };
  }

  /** 語録を更新 */
  async update(id: number, updatePopularWordDto: UpdatePopularWordRequestDto) {
    return this.prisma.popularWord.update({
      where: { id },
      data: {
        word: updatePopularWordDto.word,
        kana: updatePopularWordDto.kana,
        speakerId: updatePopularWordDto.speakerId,
      },
    });
  }
}
