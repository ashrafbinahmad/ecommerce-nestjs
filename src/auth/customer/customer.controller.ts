import { Controller, Post, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerSignupDto } from './dto/signup.dto';
import { LoginCredentials } from './dto/login-credentials.dto';
import { Tokens } from './type/tokens.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/signup')
  async customerSignup(@Body() dto: CustomerSignupDto): Promise<Tokens> {
    return await this.customerService.customerSignup(dto);
  }

  @Post('/login')
  async customerLogin(@Body() dto: LoginCredentials): Promise<Tokens> {
    return await this.customerService.customerLogin(dto);
  }

  @Post('/refresh-tokens')
  async refreshTokens(@Body() dto: RefreshTokensDto): Promise<Tokens> {
    return await this.customerService.refreshTokens(dto);
  }
}
