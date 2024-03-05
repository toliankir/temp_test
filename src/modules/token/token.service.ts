import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokenEntity } from '../../database/entity/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async getNewToken(): Promise<string> {
    const newTokenEntity: DeepPartial<TokenEntity> = {
      uuid: randomUUID(),
    };
    await this.tokenRepository.save(newTokenEntity);

    const payload = { id: newTokenEntity.uuid };
    return this.jwtService.signAsync(payload);
  }

  public async isTokenUserToken(uuid: string): Promise<boolean> {
    const tokenEntity = await this.tokenRepository.findOneOrFail({
      where: {
        uuid,
      },
    });
    return tokenEntity.isUsed;
  }

  public async updateToken(uuid: string) {
    this.tokenRepository.update({ uuid }, { isUsed: true });
  }
}
