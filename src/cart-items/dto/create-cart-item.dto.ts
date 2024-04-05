import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty()
  customerId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}
