import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EmailOrUsernameDto } from './email-or-username.dto';

export class RefreshTokenRequestDto extends EmailOrUsernameDto {
  @ApiProperty()
  @IsString()
    token: string;
}
