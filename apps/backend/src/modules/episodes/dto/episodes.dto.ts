import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

type EpisodesFindAllRequest = {
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
};

export class EpisodesFindAllRequestDto implements EpisodesFindAllRequest {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';
}

export class EpisodeCreateRequestDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  postIds: number[];

  @IsNumber()
  thumbnailPostId: number;
}

export class EpisodeUpdateRequestDto extends EpisodeCreateRequestDto {}
