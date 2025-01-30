import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

type PostsCreateRequest = {
  postedAtList: string[];
};

export class PostsCreateRequestDto implements PostsCreateRequest {
  @IsArray()
  @ArrayMinSize(1)
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { each: true, message: '正しい日付形式で入力してね' },
  )
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // form-dataがJSONで送られてくるのでパースする
      const parsed = JSON.parse(value);
      return parsed;
    }

    return value;
  })
  postedAtList: string[];
}

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
