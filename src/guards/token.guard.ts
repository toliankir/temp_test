import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../modules/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      const { id: tokenUuid, exp: tokenExp } = payload;

      const timestamp = Math.trunc(Date.now() / 1000);
      if (timestamp > tokenExp) {
        const errorMsg = `Token ${payload.id} expired`;
        this.logger.verbose(errorMsg);
        throw new Error(errorMsg);
      }

      const isTokenUsed = await this.tokenService.isTokenUsed(tokenUuid);
      if (isTokenUsed) {
        const errorMsg = `Token ${payload.id} already used`;
        this.logger.verbose(errorMsg);
        throw new Error(errorMsg);
      }

      await this.tokenService.updateToken(tokenUuid);

      const tokenModel = await this.tokenService.getTokenModel(tokenUuid);
      request['tokenModel'] = tokenModel;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.token.toString();
  }
}
