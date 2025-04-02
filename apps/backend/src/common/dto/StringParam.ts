import { IsString } from 'class-validator';

export class StringParam {
  @IsString()
  param: string;
}
