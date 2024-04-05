import { Controller, Post, Body } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerSignupDto } from './dto/signup.dto';
import { LoginCredentials } from './dto/login-credentials.dto';
import { Tokens } from './type/tokens.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/signup')
  async sellerSignup(@Body() dto: SellerSignupDto): Promise<Tokens> {
    return await this.sellerService.signup(dto);
  }

  @Post('/login')
  async sellerLogin(@Body() dto: LoginCredentials): Promise<Tokens> {
    return await this.sellerService.login(dto);
  }

  @Post('/refresh-tokens')
  async refreshTokens(@Body() dto: RefreshTokensDto): Promise<Tokens> {
    return await this.sellerService.refreshTokens(dto);
  }
}
