import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class PaginationDtoRequest {
  @ApiProperty({ example: 1 })
  @ValidateIf((e: PaginationDtoRequest) => e.offset === undefined)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 0 })
  @ValidateIf((e: PaginationDtoRequest) => !e.page)
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(100)
  count: number;
}
