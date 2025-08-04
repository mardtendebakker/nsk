import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { DataDestruction } from '../types/destruction.enum';
import { formDataDateTransform, formDataNumberTransform, formDataStringTransform } from '../../../common/transforms/form-data.transform';

export class CreatePickupUncheckedWithoutAorderInputDto implements Prisma.pickupUncheckedCreateWithoutAorderInput {
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    logistics_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataDateTransform)
  @IsOptional()
    pickup_date?: string | Date;

  @ApiPropertyOptional()
  @Transform(formDataDateTransform)
  @IsOptional()
    real_pickup_date?: string | Date;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
    origin?: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    data_destruction?: DataDestruction;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
    description?: string;

  @ApiPropertyOptional()
    afile?: Prisma.afileUncheckedCreateNestedManyWithoutPickupInput;
}
