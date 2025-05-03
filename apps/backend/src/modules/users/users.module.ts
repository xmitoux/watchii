import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseAdminService } from '@/common/services/supabase-admin.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, SupabaseService, SupabaseAdminService, UsersService],
})
export class UsersModule {}
