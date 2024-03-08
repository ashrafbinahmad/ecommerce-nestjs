import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto/local-auth.dto';
import { Tokens } from './types';
// import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
// import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { Request, request } from 'express';
import { AuthGuard } from './auth.guard';
import { RefreshTokensDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  signupLocal(@Body() localAuthDto: LocalAuthDto): Promise<Tokens> {
    return this.authService.signupLocal(localAuthDto);
  }

  @Post('signin')
  signinLocal(@Body() localAuthDto: LocalAuthDto): Promise<Tokens> {
    return this.authService.signinLocal(localAuthDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Post('refresh')
  refreshTokens(@Body() rtDto: RefreshTokensDto): Promise<Tokens> {
    return this.authService.refreshTokens(rtDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req);
  }
}
