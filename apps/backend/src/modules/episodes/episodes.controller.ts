import { Body, Controller, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';

import { IdParam } from '@/common/dto/IdParam';

import {
  EpisodeCreateRequestDto,
  EpisodesFindOneRequestDto,
  EpisodeUpdateRequestDto,
} from './dto/episodes.dto';
import {
  EpisodeFindAllResponseEntity,
  EpisodeFindEditDataResponseEntity,
  EpisodeFindOneResponseEntity,
} from './entities/episode.entity';
import { EpisodesService } from './episodes.service';

@Controller('/api/episodes')
export class EpisodesController {
  private readonly logger = new Logger(EpisodesController.name);

  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('category') category?: number,
  ): Promise<EpisodeFindAllResponseEntity> {
    this.logger.log('findAll');
    this.logger.log('%o', { limit, offset, sort, category });

    return this.episodesService.findAll({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
      category,
    });
  }

  @Get(':id')
  async findOne(
    @Param() { id }: IdParam,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<EpisodeFindOneResponseEntity> {
    this.logger.log('findOne');
    this.logger.log('%o', { limit, offset, sort });

    return this.episodesService.findOne(id, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sort,
    });
  }

  @Post()
  async create(@Body() dto: EpisodeCreateRequestDto): Promise<void> {
    this.logger.log('create');
    this.logger.log('%o', { dto });

    return await this.episodesService.create(dto);
  }

  @Get('/edit-data/:id')
  async findEditData(@Param() { id }: IdParam): Promise<EpisodeFindEditDataResponseEntity> {
    this.logger.log('findEditData');
    this.logger.log('%o', { id });

    return this.episodesService.findEditData(id);
  }

  @Put(':id')
  async update(
    @Param() { id }: IdParam,
    @Body() dto: EpisodeUpdateRequestDto,
  ): Promise<void> {
    this.logger.log('update');
    this.logger.log('%o', { id, dto });

    return await this.episodesService.update(id, dto);
  }
}
