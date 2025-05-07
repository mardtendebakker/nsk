import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { formDataDateTransform, formDataNumberTransform, formDataStringTransform } from '../../../common/transforms/form-date.transform';

export class CreateDeliveryUncheckedWithoutAorderInputDto implements Prisma.deliveryUncheckedCreateWithoutAorderInput {
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @IsOptional()
    logistics_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataDateTransform)
    date?: string | Date;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @IsOptional()
    type?: number;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsString()
  @IsOptional()
    instructions?: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsString()
  @IsOptional()
    dhl_tracking_code?: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @IsOptional()
    driver_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @IsOptional()
    vehicle_id?: number;
}
