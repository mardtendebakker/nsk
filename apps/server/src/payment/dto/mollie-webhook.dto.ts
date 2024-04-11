import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MollieWebhookDto {
  @ApiProperty()
  @IsString()
    id: string;
}
