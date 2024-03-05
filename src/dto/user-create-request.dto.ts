import {
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UserCreateDtoRequest {
  @IsString()
  @Length(2, 60)
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsNumber()
  @Min(1)
  positionId: number;
}
