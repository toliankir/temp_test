import { setSeederFactory } from 'typeorm-extension';
import { DeepPartial } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

export default setSeederFactory(UserEntity, (faker) => {
  const position: DeepPartial<UserEntity> = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };

  return position;
});
