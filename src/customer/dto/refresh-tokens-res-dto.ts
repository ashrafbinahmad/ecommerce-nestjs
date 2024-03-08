import { IsNotEmpty, IsString } from 'class-validator'
export class RefreshTokensResDto {

    access_token: string

    refresh_token: string
}