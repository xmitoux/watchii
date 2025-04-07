import { IsNumberString, IsString } from 'class-validator';

export class CreateCharacterRequestDto {
  @IsString()
  name: string;

  @IsString()
  nameKey: string;

  @IsNumberString()
  order: string;
}

export class UpdateCharacterRequestDto extends CreateCharacterRequestDto {}
