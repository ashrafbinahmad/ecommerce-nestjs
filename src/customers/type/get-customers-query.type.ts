import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetCustomersQuery {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  email?: string;
  fullname?: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  page: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  size: string;
}
