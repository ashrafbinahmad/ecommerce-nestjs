import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetCartItemQuery {
  id?: number;
  customerId?: number;
  productId?: number;
  quantity?: number;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId?: number;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  page: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  size: string;
}
