import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  logo_url?: string;
}
