import { Controller, Get, Logger, Param, Query } from '@nestjs/common';

import { StringParam } from '@/common/dto/StringParam';

import { CharactersService } from './characters.service';
import { FindAllCharactersResponse, FindPostsByCharacterResponse, GetCharactersPostCountResponse } from './entities/characters.entity';

@Controller('/api/characters')
export class CharactersController {
  private readonly logger = new Logger(CharactersController.name);

  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  async findAllCharacters(): Promise<FindAllCharactersResponse> {
    this.logger.log('findAllCharacters');

    return this.charactersService.findAllCharacters();
  }

  @Get('/get-characters-post-count')
  async getCharactersPostCount(): Promise<GetCharactersPostCountResponse> {
    this.logger.log('getCharactersPostCount');

    return this.charactersService.getCharactersPostCount();
  }

  @Get('/find-posts-by-character/:param')
  async findPostsByCharacter(
    @Param() { param }: StringParam,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<FindPostsByCharacterResponse> {
    this.logger.log('findPostsByCharacter');
    this.logger.log('%o', { param, limit, offset, sort });

    return this.charactersService.findPostsByCharacter(param, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
  }
}
