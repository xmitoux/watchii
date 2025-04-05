import { Controller, Get, Logger, Param, Query } from '@nestjs/common';

import { IdParam } from '@/common/dto/IdParam';

import { FindAllPopularWordsResponse, FindPostsByPopularWordResponse, GetPopularWordsPostCountResponse } from './entities/popular_words.entity';
import { PopularWordsService } from './popular_words.service';

@Controller('/api/popular-words')
export class PopularWordsController {
  private readonly logger = new Logger(PopularWordsController.name);

  constructor(private readonly popularWordsService: PopularWordsService) {}

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
}
