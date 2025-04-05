import { Controller, Get, Logger, Param, Query } from '@nestjs/common';

import { IdParam } from '@/common/dto/IdParam';

import { FindAllTagsResponse, FindPostsByTagResponse, GetTagsPostCountResponse } from './entities/tags.entity';
import { TagsService } from './tags.service';

@Controller('/api/tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAllTags(): Promise<FindAllTagsResponse> {
    this.logger.log('findAllTags');

    return this.tagsService.findAllTags();
  }

  @Get('/get-tags-post-count')
  async getTagsPostCount(): Promise<GetTagsPostCountResponse> {
    this.logger.log('getTagsPostCount');

    return this.tagsService.getTagsPostCount();
  }

  @Get('/find-posts-by-tag/:id')
  async findPostsByTag(
    @Param() { id }: IdParam,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<FindPostsByTagResponse> {
    this.logger.log('findPostsByTag');
    this.logger.log('%o', { id, limit, offset, sort });

    return this.tagsService.findPostsByTag(id, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
  }
}
