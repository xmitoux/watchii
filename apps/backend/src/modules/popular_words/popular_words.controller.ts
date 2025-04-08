import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { IdParam } from '@/common/dto/IdParam';

import { CreatePopularWordRequestDto, UpdatePopularWordRequestDto } from './dto/popular_words.dto';
import { FindAllPopularWordsResponse, FindPopularWordResponse, FindPostsByPopularWordResponse, GetPopularWordsPostCountResponse } from './entities/popular_words.entity';
import { PopularWordsService } from './popular_words.service';

@Controller('/api/popular-words')
export class PopularWordsController {
  private readonly logger = new Logger(PopularWordsController.name);

  constructor(private readonly popularWordsService: PopularWordsService) {}

  @Post()
  createPopularWord(@Body() dto: CreatePopularWordRequestDto) {
    this.logger.log('createPopularWord started');
    this.logger.log('%o', { dto });

    return this.popularWordsService.createPopularWord(dto);
  }

  @Get()
  async findAllPopularWords(): Promise<FindAllPopularWordsResponse> {
    this.logger.log('findAllPopularWords');

    return this.popularWordsService.findAllPopularWords();
  }

  @Get('/get-popular-words-post-count')
  async getPopularWordsPostCount(): Promise<GetPopularWordsPostCountResponse> {
    this.logger.log('getPopularWordsPostCount');
    return this.popularWordsService.getPopularWordsPostCount();
  }

  @Get('/find-posts-by-popular-word/:id')
  async findPostsByPopularWord(
    @Param() { id }: IdParam,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<FindPostsByPopularWordResponse> {
    this.logger.log('findPostsByPopularWord');
    this.logger.log('%o', { id, limit, offset, sort });

    return this.popularWordsService.findPostsByPopularWord(id, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
  }

  @Get(':id')
  async findPopularWord(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindPopularWordResponse> {
    this.logger.log('findPopularWord started');
    this.logger.log('%o', { id });

    return this.popularWordsService.findPopularWord(id);
  }

  @Put(':id')
  updatePopularWord(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePopularWordRequestDto,
  ) {
    this.logger.log('updatePopularWord started');
    this.logger.log('%o', { id, dto });

    return this.popularWordsService.update(id, dto);
  }
}
