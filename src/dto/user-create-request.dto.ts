import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Matches, Min } from 'class-validator';

export class UserCreateDtoRequest {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(2, 60)
  name: string;

  @ApiProperty({ example: 'test@mail.com' })
  // eslint-disable-next-line prettier/prettier
  @Matches(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/, { message: 'Incorrect email' })
  @IsString()
  @Length(2, 100)
  email: string;

  @ApiProperty({ example: '+380671234567' })
  @Matches(/^[\+]{0,1}380([0-9]{9})$/, { message: 'Incorrect phone' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  positionId: number;

  @ApiProperty()
  photo: unknown;
}
