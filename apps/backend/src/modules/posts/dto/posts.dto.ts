import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

type PostsFindAllRequest = {
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  episodeId?: number;
};

export class PostsFindAllRequestDto implements PostsFindAllRequest {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';

  @IsNumber()
  @IsOptional()
  episodeId?: number;
}

export class PostsFindEpisodeTargetsRequestDto extends PostsFindAllRequestDto {}
