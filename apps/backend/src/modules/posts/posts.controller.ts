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

  @Patch('/update-post-characters')
  async updatePostCharacters(
    @Body() dto: UpdatePostCharactersRequest,
  ) {
    this.logger.log('updatePostCharacters started');
    this.logger.log('%o', { dto });

    await this.postsService.updatePostCharacters(dto);
  }

  @Patch('/update-post-tags')
  async updateTags(
    @Body() dto: UpdatePostTagsRequest,
  ): Promise<void> {
    this.logger.log('updateTags started');
    this.logger.log('%o', { dto });

    await this.postsService.updatePostTags(dto);
  }

  @Patch('/update-post-popular-words')
  async updatePopularWords(
    @Body() dto: UpdatePostPopularWordsRequest,
  ): Promise<void> {
    this.logger.log('updatePopularWords started');
    this.logger.log('%o', { dto });

    await this.postsService.updatePostPopularWords(dto);
  }
}
