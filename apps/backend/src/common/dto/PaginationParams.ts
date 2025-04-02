import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationParams {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';
}
