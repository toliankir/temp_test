import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { PositionEntity } from '../../database/entity/position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
