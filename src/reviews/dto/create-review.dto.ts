import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  customerId: number;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  comment?: string;
  @ApiProperty()
  stars?: number;
}
