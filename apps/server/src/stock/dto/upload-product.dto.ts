import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UploadProductDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
    orderId: number;
}
