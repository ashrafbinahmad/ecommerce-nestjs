import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetProductsQuery {
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  color?: string;

  @IsOptional()
  material?: string;

  @IsOptional()
  weight_grams?: number;

  @IsOptional()
  price_rupee?: number;

  @IsOptional()
  offer_price_rupee?: number;

  @IsOptional()
  brandId?: number;

  @IsOptional()
  product_categoryId?: number;

  @IsOptional()
  sub_product_categoryId?: number;

  @IsOptional()
  sellerId?: number;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  page: string;

  @IsOptional()
  @IsInt()
  @Transform((val) => Number.parseInt(val.value))
  size: string;

  @IsOptional()
  search?: string;
}
