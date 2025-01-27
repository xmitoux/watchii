import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { EpisodesFindAllRequestDto } from './dto/episodes.dto';
import { EpisodeFindAllResponseEntity } from './entities/episode.entity';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: EpisodesFindAllRequestDto = {}): Promise<EpisodeFindAllResponseEntity> {
    const {
      limit = 12,
      offset = 0,
      sort = 'desc',
    } = query;

    const episodes = await this.prisma.episode.findMany({
      select: {
        id: true,
        title: true,
        thumbnailPost: {
          select: {
            imageUrl: true,
          },
        },
      },
      orderBy: {
        // サムネ画像の投稿日時でソート
        thumbnailPost: {
          postedAt: sort,
        },
      },
      take: limit,
      skip: offset,
    });

    // 全体の件数を取得(無限スクロール用)
    const total = await this.prisma.episode.count();

    return {
      episodes,
      total,
    };
  }
}
