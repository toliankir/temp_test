import { Controller, Get, UnprocessableEntityException } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionsDtoResponse } from '../../dto/positions-response.dto';
import { ServiceResponseDto } from '../../dto/service-response.dto';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  public async getPositions(): Promise<ServiceResponseDto<PositionsDtoResponse>> {
    const positions = await this.positionService.getPositions();

    if (positions.length === 0) {
      throw new UnprocessableEntityException({
        success: false,
        message: 'Positions not found',
      });
    }

    return {
      success: true,
      positions,
    };
  }
}
