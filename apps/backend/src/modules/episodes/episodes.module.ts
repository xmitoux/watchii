import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';
import { SupabaseService } from '@/common/services/supabase.service';

import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

@Module({
  controllers: [EpisodesController],
  providers: [PrismaService, SupabaseService, EpisodesService],
})
export class EpisodesModule {}
