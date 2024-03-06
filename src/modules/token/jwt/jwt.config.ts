import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  private readonly jwtSecret: string;
  private readonly jwtTtl: number;

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtTtl = this.configService.get<string>('JWT_TTL_MINUTES');

    if (!jwtSecret) {
      throw new Error('Miscofiguration JWT_SECRET must be set');
    }
    if (!jwtTtl) {
      throw new Error('Miscofiguration JWT_TTL_MINUTES must be set');
    }

    this.jwtSecret = jwtSecret;
    this.jwtTtl = parseInt(jwtTtl, 10) * 60;
  }

  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    const result = {
      global: true,
      secret: this.jwtSecret,
      signOptions: { expiresIn: `${this.jwtTtl}s` },
    };
    return result;
  }
}
