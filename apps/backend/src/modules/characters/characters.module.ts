import { Module } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  controllers: [CharactersController],
  providers: [PrismaService, CharactersService],
})
export class CharactersModule {}
