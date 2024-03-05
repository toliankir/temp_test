import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  private readonly connectionUrl: URL;
  private readonly production: boolean;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>('POSTGRES_CONNECTION_STRING');
    const mode = this.configService.get<string>('MODE');

    this.production = mode === 'PROD';
    this.connectionUrl = new URL(connectionString);
  }

  public get isProduction(): boolean {
    return this.production;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.connectionUrl.hostname,
      port: parseInt(this.connectionUrl.port, 10) || 5432,
      password: this.connectionUrl.password,
      username: this.connectionUrl.username,
      database: this.connectionUrl.pathname.split('/')[1],
      synchronize: false,
      logging: true,
      schema: this.connectionUrl.searchParams.get('schema'),
      ssl: this.isProduction,
      entities: ['dist/database/entity/*.entity.js'],
    };
  }
}
