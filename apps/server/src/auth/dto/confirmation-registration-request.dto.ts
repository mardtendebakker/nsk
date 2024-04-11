import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmRegistrationRequestDto {
  @ApiProperty()
  @IsString()
    email: string;

  @ApiProperty()
  @IsString()
    code: string;
}
