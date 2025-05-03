import { Injectable, Logger } from '@nestjs/common';

import { PaginationParams } from '@/common/dto/PaginationParams';
import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseAdminService } from '@/common/services/supabase-admin.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { RegisterUserRequestDto, ToggleUserFavsRequestDto } from './dto/users.dto';
import { GetUserFavsResponse, RegisterUserResponseEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private supabaseAdmin: SupabaseAdminService,
  ) { }

  private readonly logger = new Logger(UsersService.name);

  async getUserFavs(token: string, query: PaginationParams): Promise<GetUserFavsResponse> {
    // トークン検証してユーザー取得
    const user = await this.supabase.getUser(token);

    if (!user) {
      throw new Error('ユーザ取得に失敗しました😨');
    }

    const { limit = 12, offset = 0, sort = 'asc' } = query;

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
        favedAt: sort,
      },
      take: limit,
      skip: offset,
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
      this.logger.error('お気に入りトグル処理に失敗しました😣');
      throw error;
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
