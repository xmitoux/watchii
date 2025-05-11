import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseAdminService } from '@/common/services/supabase-admin.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { RegisterUserRequestDto, SignInWithOAuthRequestDto, ToggleUserFavsRequestDto } from './dto/users.dto';
import { GetUserFavsResponse, RegisterUserResponseEntity, SignInWithOAuthResponseEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private supabaseAdmin: SupabaseAdminService,
  ) { }

  private readonly logger = new Logger(UsersService.name);

  async getUserFavs(token: string): Promise<GetUserFavsResponse> {
    // トークン検証してユーザー取得
    const user = await this.supabase.getUser(token);

    if (!user) {
      throw new Error('ユーザ取得に失敗しました😨');
    }

    // 全体の件数を取得
    const total = await this.prisma.userFav.count({
      where: {
        userId: user.id,
      },
    });

    // ユーザーのお気に入り一覧を取得
    const favorites = await this.prisma.userFav.findMany({
      where: {
        userId: user.id,
      },
      select: {
        postId: true,
        favedAt: true,
        post: {
          select: {
            id: true,
            filename: true,
            postedAt: true,
          },
        },
      },
      orderBy: {
        favedAt: 'desc',
      },
    });

    const posts = favorites.map((fav) => fav.post);

    return {
      posts,
      total,
    };
  }

  async toggleUserFavs(token: string, { postId }: ToggleUserFavsRequestDto): Promise<void> {
    // トークン検証してユーザー取得
    const user = await this.supabase.getUser(token);

    if (!user) {
      throw new Error('ユーザ取得に失敗しました😱');
    }

    try {
    // 既存のお気に入りを確認
      const existingFav = await this.prisma.userFav.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId,
          },
        },
      });

      // TODO: テスト ちょっと遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // お気に入り登録またはお気に入り解除
      if (existingFav) {
      // 既に存在する場合は削除
        await this.prisma.userFav.delete({
          where: {
            userId_postId: {
              userId: user.id,
              postId,
            },
          },
        });
      }
      else {
      // 存在しない場合は登録
        await this.prisma.userFav.create({
          data: {
            userId: user.id,
            postId,
            favedAt: new Date(),
          },
        });
      }
    }
    catch (error) {
      // 基本的にボタンの連続クリックによるエラーなのでログだけ吐いて握りつぶす
      this.logger.error('お気に入りトグル処理に失敗しました😣 %s', error.message);
    }
  }

  async registerUser(dto: RegisterUserRequestDto): Promise<RegisterUserResponseEntity> {
    try {
      const { user, session } = await this.supabase.verifyUserRegistration(dto.token);
      if (!user || !session) {
        throw new Error('ユーザ登録検証に失敗しました😨');
      }

      this.logger.log('ユーザー登録に成功しました🎉 %o', user);

      // usersテーブルに登録
      await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          userType: 2, // 一般ユーザー
        },
      });

      this.logger.log('ユーザー登録が完了しました。');

      return { session };
    }
    catch (error) {
      this.logger.error('ユーザー登録に失敗しました😣');
      throw error;
    }
  }

  /**
   * OAuthサインイン処理
   * @param dto - OAuthサインインリクエストDTO
   * @returns - userExists: boolean (サインイン結果) true:ユーザ登録済み, false:新規登録
   */
  async signInWithOAuth(dto: SignInWithOAuthRequestDto): Promise<SignInWithOAuthResponseEntity> {
    try {
      // トークン検証してユーザー取得
      const user = await this.supabase.getUser(dto.token);

      if (!user) {
        throw new Error('ユーザ取得に失敗しました😱');
      }

      // usersテーブルに登録済みかチェック
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (existingUser) {
        this.logger.log('既存のユーザのため登録をスキップします⏩️');
        return {
          userExists: true,
        };
      }
      else {
        // usersテーブルに登録
        await this.prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            userType: 2, // 一般ユーザー
          },
        });

        this.logger.log('初回ログインユーザの登録(OAuth)が完了しました。');

        return {
          userExists: false,
        };
      }
    }
    catch (error) {
      this.logger.error('OAuthサインインに失敗しました😣');
      throw error;
    }
  }

  async deleteUser(token: string): Promise<void> {
    try {
      // トークン検証してユーザー取得
      const user = await this.supabase.getUser(token);

      if (!user) {
        throw new Error('ユーザー取得に失敗しました😨');
      }

      // usersテーブルからユーザーを削除（user_favsはcascadeで削除）
      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      // Supabaseからユーザーを削除
      await this.supabaseAdmin.deleteUser(user.id);

      this.logger.log('ユーザーの退会処理が完了しました。');
    }
    catch (error) {
      this.logger.error('ユーザーの退会処理に失敗しました😣');
      throw error;
    }
  }
}
