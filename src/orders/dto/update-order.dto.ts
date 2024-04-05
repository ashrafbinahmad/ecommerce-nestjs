import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsOptional()
  location?: string;
}
