import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { LocalAuthDto } from './dto/local-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwtPayload.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RefreshTokensDto } from './dto/refresh-token.dto';
import { error } from 'console';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(localSignupDto: LocalAuthDto): Promise<Tokens> {
    const hash = await this.hashData(localSignupDto.password);
    const newUser = await this.prisma.user
      .create({
        data: {
          email: localSignupDto.email,
          hash,
          hashedRt: '',
        },
      })
      .catch((error) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ForbiddenException(
            `Found an account with ${localSignupDto.email} as email id.`,
          );
        }
        throw error;
      });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: LocalAuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Invalid email id.');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Invalid password.');

    const tokens: Tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(req) {
    const userId = req.user.sub;
    console.log(req.user);

    if (userId == null) throw new UnauthorizedException(`Token not verified.`);

    const user = await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: '',
        },
      },
      data: {
        hashedRt: '',
      },
    });

    if (!user) {
      throw new NotFoundException(`User does not exist.`);
    }
    console.log(`Logged out the user ${req.user.email}`);
    req.user.message = 'Logged out.';
    return req.user;
  }

  async refreshTokens(rtDto: RefreshTokensDto): Promise<Tokens> {
    const payload = await this.jwtService
      .verifyAsync(rtDto.refresh_token, {
        secret: this.config.get('RT_SECRET'),
      })
      .catch((error) => {
        throw new PreconditionFailedException(
          'Refresh token verification unsuccessful, try signing in again.',
        );
      });
    console.log(payload.email);
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (user.hashedRt && bcrypt.compare(rtDto.refresh_token, user.hashedRt))
      return this.getTokens(payload?.sub, payload?.email);
    else
      throw new PreconditionFailedException(
        'The access was blocked, try signing in again.',
      );
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: this.config.get('AT_EXPIRY'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: this.config.get<string>('RT_EXPIRY'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getProfile(req) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: req.user.sub,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }
}
