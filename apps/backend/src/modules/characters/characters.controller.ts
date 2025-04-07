import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { StringParam } from '@/common/dto/StringParam';

import { CharactersService } from './characters.service';
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dto/character.dto';
import { FindAllCharactersResponse, FindCharacterResponse, FindPostsByCharacterResponse, GetCharactersPostCountResponse } from './entities/characters.entity';

@Controller('/api/characters')
export class CharactersController {
  private readonly logger = new Logger(CharactersController.name);

  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  async create(@Body() dto: CreateCharacterRequestDto): Promise<void> {
    await this.charactersService.create(dto);
  }

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

  @Get(':param')
  async findCharacter(
    @Param('param') nameKey: string,
  ): Promise<FindCharacterResponse> {
    this.logger.log('findCharacter started');
    this.logger.log('%o', { nameKey });

    return this.charactersService.findCharacter(nameKey);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterRequestDto,
  ): Promise<void> {
    await this.charactersService.update(id, dto);
  }
}
