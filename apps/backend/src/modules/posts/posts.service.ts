import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { PostsFindAllRequestDto, PostsFindEpisodeTargetsRequestDto } from './dto/posts.dto';
import { UpdatePostCharactersRequest } from './dto/UpdatePostCharactersRequest.dto';
import { UpdatePostPopularWordsRequest } from './dto/UpdatePostPopularWordsRequest.dto';
import { UpdatePostTagsRequest } from './dto/UpdatePostTagsRequest.dto';
import { FindPostPopularWordEntity, FindPostResponse, PostFindAllResponseEntity, PostsFindEpisodeTargetsResponseEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: SupabaseService,
  ) {}

  private readonly logger = new Logger(PostsService.name);

  async create(files: Express.Multer.File[]) {
    // Supabaseにアップロードしたファイルの情報を保持する配列
    const uploadedFiles: { filename: string; path: string }[] = [];

    try {
      // まず全てのファイル名の形式をチェック
      for (const file of files) {
        this.extractPostedAtFromFilename(file.originalname);
      }

      // 全ファイルをSupabaseにアップロード
      for (const file of files) {
        const path = await this.fileUploadService.uploadFile(file);
        uploadedFiles.push({
          filename: file.originalname,
          path,
        });
      }

      const result = await this.prisma.$transaction(async (tx) => {
        // DBに登録
        const posts = await Promise.all(
          uploadedFiles.map(async (uploadedFile) => {
            const postedAt = this.extractPostedAtFromFilename(uploadedFile.filename);

            return tx.post.create({
              data: {
                filename: uploadedFile.filename,
                postedAt,
              },
            });
          }),
        );

        return posts;
      }, {
        // トランザクションがタイムアウトするようなら伸ばす(未設定だと5秒っぽい)
        // timeout: 10000,
      });

      return result;
    }
    catch (error) {
      // エラー発生時は、アップロード済みのファイルを一括削除！🧹
      if (uploadedFiles.length > 0) {
        this.logger.log('Post登録中にエラーが発生...😨 半端にアップロードされたファイルを削除します🚮');

        try {
          const paths = uploadedFiles.map((file) => file.path);
          await this.fileUploadService.deleteFiles(paths);

          this.logger.log('ファイルの削除に成功しました✨️');
        }
        catch (cleanupError) {
          this.logger.error(cleanupError);
          this.logger.error('ファイルの削除に失敗しました😱 以下のファイルの手動削除が必要です…🧹');
          this.logger.error('%o', uploadedFiles.map((f) => f.path).join(', '));
        }
      }

      throw new Error(`Post登録処理に失敗しました…🥹: ${error.message}`);
    }
  }

  // ファイル名からpostedAtを抽出する関数
  private extractPostedAtFromFilename(filename: string): Date {
    // ファイル名(YYYYMMDD_HHmmss-<identifier>.ext)の形式をチェック
    const regex = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})-.*\..+$/;
    const match = filename.match(regex);

    if (!match) {
      throw new Error(`Invalid filename format: ${filename}`);
    }

    const [_, year, month, day, hour, minute, second] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }

  async findAll(query: PostsFindAllRequestDto = {}): Promise<PostFindAllResponseEntity> {
    const {
      limit,
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
        filename: true,
        postedAt: true,
      },
    });

    return {
      posts,
      total,
    };
  }

  async findEpisodeTargets(query: PostsFindEpisodeTargetsRequestDto = {}): Promise<PostsFindEpisodeTargetsResponseEntity> {
    const {
      limit = 12,
      offset = 0,
      sort = 'desc',
      episodeId = 0,
    } = query;

    // エピソード対象posts全体の件数を取得(無限スクロール用)
    const total = await this.prisma.post.count({ where: { episodeId: null } });

    // エピソード対象postsをoffset取得
    const posts = await this.prisma.post.findMany({
      select: {
        id: true,
        filename: true,
        postedAt: true,
      },
      where: {
        OR: [
        // エピソードに未設定post
          { episodeId: null },
          // Post編集ダイアログに含めるため、編集対象エピソードのpostも取得
          { episodeId },
        ],
      },
      orderBy: {
        postedAt: sort,
      },
      take: limit,
      skip: offset,
    });

    return {
      posts,
      total,
    };
  }

  async findPost(id: number): Promise<FindPostResponse> {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        filename: true,
        postedAt: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            kana: 'asc',
          },
        },
        characters: {
          select: {
            id: true,
            name: true,
            nameKey: true,
            iconFilename: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        popularWords: {
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
        },
      },
    });

    // 発言者ごとにグループ化
    const speakerMap = new Map<number, FindPostPopularWordEntity>();

    post.popularWords.forEach((word) => {
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
      post: {
        ...post,
        popularWords: groupedPopularWords,
      },
    };
  }

  async updatePostCharacters(dto: UpdatePostCharactersRequest) {
    try {
      const { postId, characterIds } = dto;

      await this.prisma.$transaction(async (tx) => {
        // 現在のキャラリレーションをすべて削除
        await tx.post.update({
          where: { id: postId },
          data: {
            characters: {
              set: [],
            },
          },
        });

        // 新しいキャラリレーションで置き換える
        await tx.post.update({
          where: { id: postId },
          data: {
            characters: {
              connect: characterIds.map((characterId) => ({ id: characterId })),
            },
          },
        });
      });
    }
    catch (error) {
      throw new Error(`Postのキャラ更新に失敗しました: ${error.message}`);
    }
  }

  async updatePostTags(dto: UpdatePostTagsRequest) {
    try {
      const { postId, tagIds } = dto;

      // 現在のタグリレーションをすべて削除
      await this.prisma.$transaction(async (tx) => {
        await tx.post.update({
          where: { id: postId },
          data: {
            tags: {
              set: [],
            },
          },
        });

        // 新しいタグリレーションで置き換える
        await tx.post.update({
          where: { id: postId },
          data: {
            tags: {
              connect: tagIds.map((tagId) => ({ id: tagId })),
            },
          },
        });
      });
    }
    catch (error) {
      throw new Error(`Postのタグ更新に失敗しました: ${error.message}`);
    }
  }

  async updatePostPopularWords(dto: UpdatePostPopularWordsRequest) {
    try {
      const { postId, popularWordIds } = dto;

      await this.prisma.$transaction(async (tx) => {
        // 現在の語録リレーションをすべて削除
        await tx.post.update({
          where: { id: postId },
          data: {
            popularWords: {
              set: [],
            },
          },
        });

        // 新しい語録リレーションで置き換える
        await tx.post.update({
          where: { id: postId },
          data: {
            popularWords: {
              connect: popularWordIds.map((popularWordId) => ({ id: popularWordId })),
            },
          },
        });
      });
    }
    catch (error) {
      throw new Error(`Postの語録更新に失敗しました: ${error.message}`);
    }
  }
}
