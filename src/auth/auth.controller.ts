/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AnyRoleGuard } from './role.guard';
import { RefreshTokensDto } from './refresh-tokens.dto';
import { Tokens } from './tokens.type';

@ApiTags('Auth')
@Controller('/auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiTags('Admin access', 'Customer access', 'Seller access')
  @UseGuards(AnyRoleGuard)
  @Get('whoami')
  async whoami(): Promise<any> {
    return await this.authService.whoami();
  }

  @Post('/refresh-tokens')
  async refreshTokens(@Body() dto: RefreshTokensDto): Promise<Tokens> {
    return await this.authService.refreshTokens(dto);
  }
}
