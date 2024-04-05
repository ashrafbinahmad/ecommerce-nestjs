import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AdminSignupDto } from './dto/signup.dto';
import { AdminLoginCredentials } from './dto/login-credentials.dto';
import { Tokens } from './type/tokens.type';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './type/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AdminSignupDto): Promise<Tokens> {
    const newUser = await this.prisma.admin
      .create({
        data: {
          username: dto.username,
          hash: await bcrypt.hash(dto.password, 10),
        },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ForbiddenException(`Email ${dto.username} already exists.`);
        }
        throw error;
      });

    const tokens = await this.getTokens(newUser.id, newUser.username, 'ADMIN');
    return tokens;
  }

  async login(dto: AdminLoginCredentials): Promise<Tokens> {
    const user = await this.prisma.admin.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user)
      throw new ForbiddenException(
        'This email is not registered. Try signing up.',
      );
    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Incorrect password.');

    const tokens = await this.getTokens(user.id, user.username, 'ADMIN');
    return tokens;
  }

  // refreshTokens(dto: RefreshTokensDto): TokensDto {}

  async refreshTokens(rtDto: RefreshTokensDto): Promise<Tokens> {
    const payload = await this.jwtService
      .verifyAsync(rtDto.refresh_token, {
        secret: this.config.get('RT_SECRET'),
      })
      .catch(() => {
        throw new ForbiddenException(
          'Refresh token verification unsuccessful, try signing in again.',
        );
      });
    const user = await this.prisma.admin.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user)
      throw new BadRequestException('Not found user for this refresh token.');

    return this.getTokens(payload?.sub, payload?.email, 'ADMIN');
  }

  async getTokens(sub, username, role): Promise<Tokens> {
    const payload: JwtPayload = {
      sub,
      username,
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
