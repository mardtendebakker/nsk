import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, ValidateIf } from 'class-validator';
import { DataDestruction } from '../types/destruction.enum';

export class CreatePickupUncheckedWithoutAorderInputDto implements Prisma.pickupUncheckedCreateWithoutAorderInput {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    logistics_id?: number;

  @ApiPropertyOptional()
    pickup_date?: string | Date;

  @ApiPropertyOptional()
    real_pickup_date?: string | Date;

  @ApiPropertyOptional()
    origin?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    data_destruction?: DataDestruction;

  @ApiPropertyOptional()
    description?: string;

  @ApiPropertyOptional()
    afile?: Prisma.afileUncheckedCreateNestedManyWithoutPickupInput;
}
