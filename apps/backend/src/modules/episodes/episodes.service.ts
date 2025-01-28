import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { EpisodeCreateRequestDto, EpisodesFindAllRequestDto } from './dto/episodes.dto';
import { EpisodeFindAllResponseEntity, EpisodeFindOneResponseEntity } from './entities/episode.entity';

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

  async findOne(id: number, query: EpisodesFindAllRequestDto = {}): Promise<EpisodeFindOneResponseEntity> {
    const {
      limit = 12,
      offset = 0,
      sort = 'desc',
    } = query;

    const episode = await this.prisma.episode.findFirstOrThrow({
      select: {
        id: true,
        title: true,
        posts: {
          select: {
            id: true,
            imageUrl: true,
          },
          orderBy: {
            postedAt: sort,
          },
          take: limit,
          skip: offset,
        },
        // postsの件数を取得(無限スクロール用)
        _count: {
          select: { posts: true },
        },
      },
      where: {
        id,
      },
    });

    return {
      episodeTitle: episode.title,
      posts: episode.posts,
      total: episode._count.posts,
    };
  }

  async create(dto: EpisodeCreateRequestDto): Promise<void> {
    // 指定されたpostのチェック
    const posts = await this.prisma.post.findMany({
      where: {
        // postIdsとthumbnailPostIdに指定されたpostが存在するかチェック
        id: {
          in: [...dto.postIds, dto.thumbnailPostId],
        },
        // すでにエピソードに紐付いているpostは設定できない
        episodeId: null,
      },
    });

    // リクエストとチェック結果の数が不一致ならエラー
    // (存在しないpostがあるか、すでにエピソードに紐付いているpostが指定された)
    if (posts.length !== new Set([...dto.postIds, dto.thumbnailPostId]).size) {
      throw new Error('指定されたpostが不正です！😱');
    }

    // トランザクション内で作成処理を実行
    await this.prisma.$transaction(async (tx) => {
      // エピソードを作成
      const createdEpisode = await tx.episode.create({
        data: {
          title: dto.title,
          thumbnailPostId: dto.thumbnailPostId,
        },
      });

      // postとエピソードを紐付け
      await tx.post.updateMany({
        where: {
          id: {
            in: dto.postIds,
          },
        },
        data: {
          episodeId: createdEpisode.id,
        },
      });
    });
  }
}
