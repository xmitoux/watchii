import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostCharactersRequest {
  @IsNumber()
  postId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  characterIds: number[];
}
