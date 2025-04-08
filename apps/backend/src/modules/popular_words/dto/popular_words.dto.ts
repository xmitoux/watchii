import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePopularWordRequestDto {
  @IsNotEmpty()
  @IsString()
  word: string;

  @IsNotEmpty()
  @IsString()
  kana: string;

  @IsNotEmpty()
  @IsNumber()
  speakerId: number;
}

export class UpdatePopularWordRequestDto extends CreatePopularWordRequestDto {}
