import { IsArray, IsNumber } from 'class-validator';

export class UpdatePostCharactersRequest {
  @IsArray()
  @IsNumber({}, { each: true })
  characterIds: number[];
}
