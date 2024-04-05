import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(10)
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(15)
  @IsString()
  fullname: string;
}
