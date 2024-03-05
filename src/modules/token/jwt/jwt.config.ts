import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  private readonly jwtSecret: string;
  private readonly jwtTtl: number;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    this.jwtTtl =
      parseInt(this.configService.get<string>('JWT_TTL_MINUTES'), 10) * 60;
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
