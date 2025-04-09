import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostTagsRequest {
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];
}
