import { Controller, Post, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerSignupReqDto } from './dto/signup-req.dto';
import { CustomerSignupResDto } from './dto/signup-res.dto';
import { CustomerLoginReqDto } from './dto/login-req.dto';
import { CustomerLoginResDto } from './dto/login-res.dto';
import { RefreshTokensReqDto } from './dto/refresh-tokens-req.dto';
import { RefreshTokensResDto } from './dto/refresh-tokens-res-dto';

@Controller('customer/auth')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/signup')
  customerSignup(@Body() dto: CustomerSignupReqDto): CustomerSignupResDto {
    
  }

  @Post('/login')
  customerLogin(@Body() dto: CustomerLoginReqDto ): CustomerLoginResDto {}

  @Post('/refresh-tokens')
  refreshTokens(@Body() dto: RefreshTokensReqDto): RefreshTokensResDto {}

  @Post('/logout')
  customerLogout(){}

}
