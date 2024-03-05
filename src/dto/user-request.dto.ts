import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UserDtoRequest {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  id: number;
}
