import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokensDto {
    @IsNotEmpty()
    @IsString()
    refresh_token: string;
}