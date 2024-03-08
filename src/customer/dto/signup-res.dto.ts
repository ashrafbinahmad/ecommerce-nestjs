import { IsNotEmpty, IsString } from 'class-validator'
export class CustomerSignupResDto {

    access_token: string

    refresh_token: string
}