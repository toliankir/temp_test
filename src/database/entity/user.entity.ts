import { PositionEntity } from '../entity/position.entity';
import { TokenEntity } from '../entity/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id!: number;

  @Column({ name: 'name' })
  public readonly name!: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt!: Date;

  @Column({ name: 'position_id' })
  public readonly positionId!: number;

  @Column({ name: 'token_id' })
  public readonly tokenId!: number;

  @Column({ name: 'email' })
  public readonly email!: string;

  @Column({ name: 'phone' })
  public readonly phone!: string;

  // @Column({ name: 'photo' })
  // public readonly photo!: Buffer;

  @ManyToOne(() => PositionEntity)
  @JoinColumn([{ name: 'position_id', referencedColumnName: 'id' }])
  public readonly position!: PositionEntity;

  @ManyToOne(() => TokenEntity)
  @JoinColumn([{ name: 'token_id', referencedColumnName: 'id' }])
  public readonly token!: TokenEntity;
}
