import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateIf } from 'class-validator';

export class CreateDeliveryUncheckedWithoutAorderInputDto implements Prisma.deliveryUncheckedCreateWithoutAorderInput {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    logistics_id?: number;

  @ApiPropertyOptional()
    date?: string | Date;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    type?: number;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    instructions?: string;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    dhl_tracking_code?: string;
}
