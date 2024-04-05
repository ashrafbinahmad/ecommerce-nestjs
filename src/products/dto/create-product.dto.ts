import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, NotEquals } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsOptional()
  material?: string;

  @ApiProperty()
  @IsOptional()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  weight_grams?: number;

  @ApiProperty()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  price_rupee: number;

  @ApiProperty()
  @IsOptional()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  offer_price_rupee?: number;

  @ApiProperty()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  stock: number;

  @ApiProperty()
  thumb_image_url: string;

  @ApiProperty()
  @IsOptional()
  image_1_url?: string;

  @ApiProperty()
  @IsOptional()
  image_2_url?: string;

  @ApiProperty()
  @IsOptional()
  image_3_url?: string;

  @ApiProperty()
  @IsOptional()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  product_categoryId: number;

  @ApiProperty()
  @IsOptional()
  @NotEquals('')
  @Type(() => Number)
  @IsNumber()
  sellerId: number;
}
