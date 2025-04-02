import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

import { FindAllCharactersResponse } from './entities/characters.entity';

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  private readonly logger = new Logger(CharactersService.name);

  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    const characters = await this.prisma.character.findMany({
      select: {
        id: true,
        name: true,
        nameKey: true,
        iconFilename: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return {
      characters,
    };
  }
}
