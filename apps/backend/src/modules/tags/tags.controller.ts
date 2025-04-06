import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { IdParam } from '@/common/dto/IdParam';

import { CreateTagRequestDto, UpdateTagRequestDto } from './dto/tags.dto';
import { FindAllTagsResponse, FindPostsByTagResponse, FindTagResponse, GetTagsPostCountResponse } from './entities/tags.entity';
import { TagsService } from './tags.service';

@Controller('/api/tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createTag(@Body() createTagDto: CreateTagRequestDto) {
    this.logger.log('createTag');
    this.logger.log('%o', { createTagDto });

    return this.tagsService.create(createTagDto);
  }

  @Get()
  async findAllTags(): Promise<FindAllTagsResponse> {
    this.logger.log('findAllTags started');

    return this.tagsService.findAllTags();
  }

  @Get(':id')
  async findTag(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindTagResponse> {
    this.logger.log('findTag started');
    this.logger.log('%o', { id });

    return this.tagsService.findTag(id);
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

  @Put(':id')
  updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagRequestDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }
}
