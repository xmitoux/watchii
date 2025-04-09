import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostPopularWordsRequest {
  @IsArray()
  @IsNumber({}, { each: true })
  popularWordIds: number[];
}
