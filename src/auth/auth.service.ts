import {
  ForbiddenException,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { RefreshTokensDto } from './refresh-tokens.dto';
import { Tokens } from './tokens.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async whoami(): Promise<any> {
    const user = this.request['user'];
    console.log(user);
    let userData: any;
    if (!user) throw new ForbiddenException('Not having any role.');
    else if (user.role === 'ADMIN') {
      userData = await this.prisma.admin.findFirst({ where: { id: user.sub } });
      userData.userType = user.role;
    } else if (user.role === 'SELLER') {
      userData = await this.prisma.seller.findFirst({
        where: { id: user.sub },
      });
      userData.fullname = userData.company_name;
      userData.userType = user.role;
    } else if (user.role === 'CUSTOMER') {
      userData = await this.prisma.customer.findFirst({
        where: { id: user.sub },
      });
      userData.userType = user.role;
    } else {
      userData = 'no user';
    }
    if (userData.hash) delete userData.hash;
    return userData;
  }

  async refreshTokens(rtDto: RefreshTokensDto): Promise<Tokens> {
    console.log('Refreshed tokens.');
    const payload = await this.jwtService
      .verifyAsync(rtDto.refresh_token, {
        secret: this.config.get('RT_SECRET'),
      })
      .catch(() => {
        throw new ForbiddenException(
          'Refresh token verification unsuccessful, try signing in again.',
        );
      });
    const user = await this.prisma.seller.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user)
      throw new BadRequestException('Not found user for this refresh token.');

    return this.getTokens(payload?.sub, payload?.email, payload?.role);
  }

  async getTokens(sub, email, role): Promise<Tokens> {
    const payload: JwtPayload = {
      sub,
      email,
      role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('AT_SECRET'),
        expiresIn: this.config.get('AT_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('RT_SECRET'),
        expiresIn: this.config.get('RT_EXPIRY'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
