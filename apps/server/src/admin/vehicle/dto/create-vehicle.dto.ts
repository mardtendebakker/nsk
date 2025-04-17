import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
    name: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
    registration_number: string;
}
