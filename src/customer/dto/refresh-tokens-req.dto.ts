import { IsNotEmpty, IsString } from 'class-validator'
export class RefreshTokensReqDto {
    @IsNotEmpty()
    @IsString()
    refresh_token: string
}