import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostTagsRequest {
  @IsNumber()
  postId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];
}
