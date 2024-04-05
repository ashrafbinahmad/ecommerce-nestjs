import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminSignupDto } from './dto/signup.dto';
import { AdminLoginCredentials } from './dto/login-credentials.dto';
import { Tokens } from './type/tokens.type';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';

@ApiTags('Auth')
@Controller('auth/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiTags('Admin access')
  @UseGuards(AdminGuard)
  @Post('/signup')
  async signup(@Body() dto: AdminSignupDto): Promise<Tokens> {
    return await this.adminService.signup(dto);
  }

  @Post('/login')
  async login(@Body() dto: AdminLoginCredentials): Promise<Tokens> {
    return await this.adminService.login(dto);
  }

  @Post('/refresh-tokens')
  async refreshTokens(@Body() dto: RefreshTokensDto): Promise<Tokens> {
    return await this.adminService.refreshTokens(dto);
  }
}
