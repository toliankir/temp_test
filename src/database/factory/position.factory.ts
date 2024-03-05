import { setSeederFactory } from 'typeorm-extension';
import { PositionEntity } from '../entity/position.entity';
import { DeepPartial } from 'typeorm';

export default setSeederFactory(PositionEntity, (faker) => {
  const position: DeepPartial<PositionEntity> = {
    name: faker.person.jobTitle(),
  };

  return position;
});
