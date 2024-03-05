import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id!: number;

  @Column({ name: 'uuid' })
  public readonly uuid!: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt!: Date;

  @Column({ name: 'is_used' })
  public readonly isUsed!: boolean;
}
