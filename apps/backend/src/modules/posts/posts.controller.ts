import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsCreateRequestDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('/api/posts')
export class PostsController {
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
  async findAll() {
    return this.postsService.findAll();
  }
}
