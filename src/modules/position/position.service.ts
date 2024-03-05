import { Injectable } from '@nestjs/common';
import { PositionEntity } from '../../database/entity/position.entity';
import { Repository } from 'typeorm';
import { PositionDtoResponse } from '../../dto/position-response.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  public async getPositions(): Promise<PositionDtoResponse[]> {
    const positionEntities = await this.positionRepository.find();
    return positionEntities.map((e) => ({
      id: e.id,
      name: e.name,
    }));
  }
}
