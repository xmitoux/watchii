import { IsNumber } from 'class-validator';

export class IdParam {
  @IsNumber()
  id: number;
}
