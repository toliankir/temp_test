import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UserCreateDtoRequest {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(2, 60)
  name: string;

  @ApiProperty({ example: 'test@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+380-66-7666029' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  positionId: number;
}
