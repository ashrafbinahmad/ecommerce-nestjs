import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetOrdersQuery {
  customerId?: number;
  productId?: number;
  quantity?: number;
  address?: string;
  sellerId?: number;
  status?: string;
  location?: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  page: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  size: string;
}
