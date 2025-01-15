import { Module } from '@nestjs/common';

import { FileUploadService } from '@/common/services/file-upload.service';
import { PrismaService } from '@/common/services/prisma.service';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PrismaService, FileUploadService, PostsService],
})
export class PostsModule {}
