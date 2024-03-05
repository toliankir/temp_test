import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { SeederOptions } from 'typeorm-extension';

const connectionString = process.env.POSTGRES_CONNECTION_STRING;
const connectionUrl = new URL(connectionString);

export const dbdatasource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: connectionUrl.hostname,
  port: parseInt(connectionUrl.port, 10) || 5432,
  password: connectionUrl.password,
  username: connectionUrl.username,
  database: connectionUrl.pathname.split('/')[1],
  logging: true,
  entities: ['dist/database/entity/*.entity.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  seeds: ['dist/database/seeds/**/*.js'],
  factories: ['dist/database/factory/**/*.js'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrationsRun: false,
  schema: connectionUrl.searchParams.get('schema'),
  ssl: false,
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
