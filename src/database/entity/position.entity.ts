import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id!: number;

  @Column({ name: 'name' })
  public readonly name!: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt!: Date;
}
