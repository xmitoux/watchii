import { IsString } from 'class-validator';

export class CreateTagRequestDto {
  @IsString()
  name: string;

  @IsString()
  kana: string;
}

export class UpdateTagRequestDto extends CreateTagRequestDto {}
