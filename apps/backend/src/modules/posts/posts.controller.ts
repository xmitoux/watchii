import { Body, Controller, Get, Logger, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsCreateRequestDto } from './dto/posts.dto';
import { PostFindAllResponseEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('/api/posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() postsCreateRequestDto: PostsCreateRequestDto,
  ) {
    return this.postsService.create(files, postsCreateRequestDto.postedAtList);
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
}
