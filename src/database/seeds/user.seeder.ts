import { PositionEntity } from '../entity/position.entity';
import { TokenEntity } from '../entity/token.entity';
import { UserEntity } from '../entity/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PositionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(`
      TRUNCATE "user" RESTART IDENTITY;
      TRUNCATE "token" RESTART IDENTITY CASCADE;
      TRUNCATE "position" RESTART IDENTITY CASCADE;
    `);
    const tokenFactory = factoryManager.get(TokenEntity);
    await tokenFactory.saveMany(5);

    const positionFactory = factoryManager.get(PositionEntity);
    await positionFactory.saveMany(5);

    const userFactory = factoryManager.get(UserEntity);
    await userFactory.saveMany(45);
  }
}
