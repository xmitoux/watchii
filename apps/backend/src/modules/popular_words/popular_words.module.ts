import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { PopularWordsController } from './popular_words.controller';
import { PopularWordsService } from './popular_words.service';

@Module({
  controllers: [PopularWordsController],
  providers: [PopularWordsService, PrismaService],
})
export class PopularWordsModule {}
