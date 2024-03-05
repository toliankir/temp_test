import { setSeederFactory } from 'typeorm-extension';
import { randomUUID } from 'crypto';
import { DeepPartial } from 'typeorm';
import { TokenEntity } from '../entity/token.entity';

export default setSeederFactory(TokenEntity, () => {
  const token: DeepPartial<TokenEntity> = {
    uuid: randomUUID(),
    isUsed: true,
  };

  return token;
});
