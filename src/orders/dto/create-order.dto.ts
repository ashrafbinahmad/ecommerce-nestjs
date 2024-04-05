import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, NotEquals } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @NotEquals('')
  @Type(() => Number)
  @IsInt()
  customerId: number;

  @ApiProperty()
  @NotEquals('')
  @Type(() => Number)
  @IsInt()
  productId: number;

  @ApiProperty()
  @NotEquals('')
  @Type(() => Number)
  @Min(1)
  @IsInt()
  quantity: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  location: string;
}
