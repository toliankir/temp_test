import { IsNumber, Min } from 'class-validator';

export class UserDtoRequest {
  @IsNumber()
  @Min(1)
  id: number;
}
