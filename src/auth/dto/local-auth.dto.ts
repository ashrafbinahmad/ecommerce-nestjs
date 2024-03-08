import { IsNotEmpty, IsString } from 'class-validator';

export class LocalAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
