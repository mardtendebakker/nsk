import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
    email: string;

  @ApiProperty()
  @IsString()
    username: string;

  @ApiProperty()
  @IsString()
    password: string;
}
