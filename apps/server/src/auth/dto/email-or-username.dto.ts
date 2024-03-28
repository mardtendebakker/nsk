import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailOrUsernameDto {
  @ApiProperty()
  @IsString()
    emailOrUsername: string;
}
