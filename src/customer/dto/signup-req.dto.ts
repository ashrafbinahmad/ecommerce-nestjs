import { IsNotEmpty, IsString } from 'class-validator'
export class CustomerSignupReqDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
}