import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @ApiProperty()
  comment?: string;

  @IsOptional()
  @ApiProperty()
  stars?: number;
}
