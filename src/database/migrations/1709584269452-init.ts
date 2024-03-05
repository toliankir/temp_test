import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1709584269452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE "position" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(60) NOT NULL,
        "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
    );
    
    CREATE TABLE "token" (
        "id" SERIAL PRIMARY KEY,
        "uuid" UUID NOT NULL,
        "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
        "is_used" BOOLEAN DEFAULT FALSE    
    );

    CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "position_id" INT NOT NULL,
        "token_id" INT NOT NULL,
        "name" VARCHAR(60) NOT NULL,
        "email" VARCHAR(100) NOT NULL,
        "phone" VARCHAR(32) NOT NULL,
        "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
        "photo" BYTEA NOT NULL,
    CONSTRAINT "uq__user__email" UNIQUE ("email"),
    CONSTRAINT "uq__user__phone" UNIQUE ("phone"),
    CONSTRAINT "fk__user__position" FOREIGN KEY ("position_id") REFERENCES "position" ("id"),
    CONSTRAINT "fk__user__token" FOREIGN KEY ("token_id") REFERENCES "token" ("id")
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    DROP TABLE "position";
    DROP TABLE "token";
    DROP TABLE "user";
    `);
  }
}
