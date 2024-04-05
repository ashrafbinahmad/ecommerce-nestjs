import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SellerSignupDto } from './dto/signup.dto';
import { LoginCredentials } from './dto/login-credentials.dto';
import { Tokens } from './type/tokens.type';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './type/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';

@Injectable()
export class SellerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SellerSignupDto): Promise<Tokens> {
    const newUser = await this.prisma.seller
      .create({
        data: {
          email: dto.email,
          hash: await bcrypt.hash(dto.password, 10),
          company_name: dto.company_name,
        },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ForbiddenException(`Email ${dto.email} already exists.`);
        }
        throw error;
      });

    const tokens = await this.getTokens(newUser.id, newUser.email, 'SELLER');
    return tokens;
  }

  async login(dto: LoginCredentials): Promise<Tokens> {
    const user = await this.prisma.seller.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException(
        'This email is not registered. Try signing up.',
      );
    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Incorrect password.');

    const tokens = await this.getTokens(user.id, user.email, 'SELLER');
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
    const user = await this.prisma.seller.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user)
      throw new BadRequestException('Not found user for this refresh token.');

    return this.getTokens(payload?.sub, payload?.email, 'SELLER');
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
