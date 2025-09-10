import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { PrismaAOrderCreateInputDto } from './prisma-aorder-create-input.dto';
import { CreateContactAOrderDto } from './create-contact-aorder.dto';
import { CreatePickupUncheckedWithoutAorderInputDto } from '../../calendar/pickup/dto/create-pickup-unchecked-without-aorder-input.dto';
import { CreateDeliveryUncheckedWithoutAorderInputDto } from '../../calendar/delivery/dto/create-delivery-unchecked-without-aorder-input.dto';
import { CreateRepairUncheckedWithoutAOrderInputDto } from '../../repair/dto/create-repair-unchecked-without-aorder-input.dt';
import { formDataBoolTransform, formDataDateTransform, formDataNumberTransform } from '../../common/transforms/form-data.transform';

export class CreateAOrderDto extends OmitType(PrismaAOrderCreateInputDto, [
  'discr',
  'order_date',
  'is_gift',
  'aorder',
  'other_aorder',
  'pickup',
  'delivery',
  'repair',
] as const) {
  @ApiPropertyOptional()
  @Transform(formDataDateTransform)
  @IsOptional()
    order_date?: Date;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    status_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataBoolTransform)
  @IsBoolean()
  @IsOptional()
    is_gift?: boolean;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    customer_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    supplier_id?: number;

  @ApiPropertyOptional()
  @Type(() => CreatePickupUncheckedWithoutAorderInputDto)
    pickup?: CreatePickupUncheckedWithoutAorderInputDto;

  @ApiPropertyOptional()
  @Type(() => CreateDeliveryUncheckedWithoutAorderInputDto)
    delivery?: CreateDeliveryUncheckedWithoutAorderInputDto;

  @ApiPropertyOptional()
  @Type(() => CreateRepairUncheckedWithoutAOrderInputDto)
    repair?: CreateRepairUncheckedWithoutAOrderInputDto;

  @ApiPropertyOptional()
  @Type(() => CreateContactAOrderDto)
    customer?: CreateContactAOrderDto;

  @ApiPropertyOptional()
  @Type(() => CreateContactAOrderDto)
    supplier?: CreateContactAOrderDto;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Multiple images',
  })
  @Type(() => Object)
    pi?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Single PDF',
  })
  @Type(() => Object)
    pa?: Express.Multer.File;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Multiple images',
  })
  @Type(() => Object)
    di?: Express.Multer.File[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Single PDF',
  })
  @Type(() => Object)
    da?: Express.Multer.File;
}
