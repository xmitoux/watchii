import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostPopularWordsRequest {
  @IsNumber()
  postId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  popularWordIds: number[];
}
