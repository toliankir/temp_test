import { Global, Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from '../../database/entity/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt/jwt.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.registerAsync({
      global: true,
      useClass: JwtConfig,
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
