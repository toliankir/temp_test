import { IsNumber, Max, Min, ValidateIf } from 'class-validator';

export class PaginationDtoRequest {
  @ValidateIf((e: PaginationDtoRequest) => e.offset === undefined)
  @IsNumber()
  @Min(1)
  page?: number;

  @ValidateIf((e: PaginationDtoRequest) => !e.page)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  count: number;
}
