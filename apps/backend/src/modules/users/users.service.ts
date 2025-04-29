import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { RegisterUserRequestDto } from './dto/users.dto';
import { RegisterUserResponseEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) { }

  private readonly logger = new Logger(UsersService.name);

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
}
