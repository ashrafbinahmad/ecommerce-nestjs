import { IsNotEmpty, IsString } from 'class-validator'
export class CustomerLoginReqDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
}