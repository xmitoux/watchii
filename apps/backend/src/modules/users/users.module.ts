import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, SupabaseService, UsersService],
})
export class UsersModule {}
