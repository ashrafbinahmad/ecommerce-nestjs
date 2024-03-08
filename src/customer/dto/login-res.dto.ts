import { IsNotEmpty, IsString } from 'class-validator'
export class CustomerLoginResDto {

    access_token: string

    refresh_token: string
}