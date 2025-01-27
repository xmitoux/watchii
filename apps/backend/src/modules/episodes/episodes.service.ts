import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { EpisodesFindAllRequestDto } from './dto/episodes.dto';
import { EpisodeFindAllResponseEntity } from './entities/episode.entity';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(EpisodesService.name);

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
        // エピソードに含まれるpostの件数を取得
        _count: {
          select: { posts: true },
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

    // レスポンスの整形
    const mappedEpisodes = episodes.map(episode => ({
      ...episode,
      // エピソードに含まれるpostの件数を追加
      totalPosts: episode._count.posts,
    }));

    // 全体の件数を取得(無限スクロール用)
    const total = await this.prisma.episode.count();

    return {
      episodes: mappedEpisodes,
      total,
    };
  }
}
