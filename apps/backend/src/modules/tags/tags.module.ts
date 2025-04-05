import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsController],
  providers: [PrismaService, TagsService],
})
export class TagsModule {}
