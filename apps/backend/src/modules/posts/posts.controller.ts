import { Body, Controller, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UpdatePostCharactersRequest } from './dto/UpdatePostCharactersRequest.dto';
import { UpdatePostPopularWordsRequest } from './dto/UpdatePostPopularWordsRequest.dto';
import { UpdatePostTagsRequest } from './dto/UpdatePostTagsRequest.dto';
import { FindPostResponse, PostFindAllResponseEntity, PostsFindEpisodeTargetsResponseEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('/api/posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(@UploadedFiles() files: Express.Multer.File[]) {
    return this.postsService.create(files);
  }

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<PostFindAllResponseEntity> {
    this.logger.log('findAll');
    this.logger.log('%o', { limit, offset, sort });

    return this.postsService.findAll({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
  }

  @Get('/episode-targets')
  async findEpisodeTargets(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('episodeId') episodeId?: number,
  ): Promise<PostsFindEpisodeTargetsResponseEntity> {
    this.logger.log('findEpisodeTargets');
    this.logger.log('%o', { limit, offset, sort, episodeId });

    return this.postsService.findEpisodeTargets({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
      episodeId,
    });
  }

  @Get(':id')
  async findPost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindPostResponse> {
    this.logger.log('findPost started');
    this.logger.log('%o', { id });

    return this.postsService.findPost(id);
  }

  @Patch(':id/update-post-characters')
  async updatePostCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostCharactersRequest,
  ) {
    this.logger.log('updatePostCharacters started');
    this.logger.log('%o', { id, characterIds: dto.characterIds });

    await this.postsService.updatePostCharacters(id, dto);
  }

  @Patch(':id/update-post-tags')
  async updateTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostTagsRequest,
  ): Promise<void> {
    this.logger.log('updateTags started');
    this.logger.log('%o', { id, tagIds: dto.tagIds });

    await this.postsService.updatePostTags(id, dto);
  }

  @Patch(':id/update-post-popular-words')
  async updatePopularWords(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostPopularWordsRequest,
  ): Promise<void> {
    this.logger.log('updatePopularWords started');
    this.logger.log('%o', { id, popularWordIds: dto.popularWordIds });

    await this.postsService.updatePostPopularWords(id, dto);
  }
}
