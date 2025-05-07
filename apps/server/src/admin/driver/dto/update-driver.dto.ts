import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateDriverDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
    first_name: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
    last_name: string;
}
