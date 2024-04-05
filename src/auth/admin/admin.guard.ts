import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService
        .verifyAsync(token, {
          secret: this.config.get('AT_SECRET'),
        })
        .catch((error) => {
          if (error instanceof JsonWebTokenError)
            throw new UnauthorizedException('Invalid token.');
          else throw error;
        });
      if (payload.role != 'ADMIN') throw new UnauthorizedException();
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expired');
      else if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException('Invalid token.');
      else throw error;
    }
    console.log(request.user);
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
