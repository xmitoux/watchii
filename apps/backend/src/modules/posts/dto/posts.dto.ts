import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsISO8601 } from 'class-validator';

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
