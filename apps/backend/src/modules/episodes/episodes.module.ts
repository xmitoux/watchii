import { Module } from '@nestjs/common';

import { FileUploadService } from '@/common/services/file-upload.service';
import { PrismaService } from '@/common/services/prisma.service';

import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';

@Module({
  controllers: [EpisodesController],
  providers: [PrismaService, FileUploadService, EpisodesService],
})
export class EpisodesModule {}
