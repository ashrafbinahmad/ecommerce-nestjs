import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetBrandsQuery {
  name?: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  page: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  size: string;
}
