import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetCommonDto {
  @ApiProperty()
  @IsString()
    recaptchaKey: string;

  @ApiProperty()
    orderStatusName?: string;
}
