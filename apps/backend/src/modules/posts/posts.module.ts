import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PrismaService, SupabaseService, PostsService],
})
export class PostsModule {}
