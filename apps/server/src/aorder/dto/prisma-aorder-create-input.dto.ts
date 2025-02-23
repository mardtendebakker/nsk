import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsNumber, IsString, ValidateIf,
} from 'class-validator';
import { CreatePickupUncheckedWithoutAorderInputDto } from '../../calendar/pickup/dto/create-pickup-unchecked-without-aorder-input.dto';
import { CreateRepairUncheckedWithoutAOrderInputDto } from '../../repair/dto/create-repair-unchecked-without-aorder-input.dt';
import { CreateDeliveryUncheckedWithoutAorderInputDto } from '../../calendar/delivery/dto/create-delivery-unchecked-without-aorder-input.dto';

export class PrismaAOrderCreateInputDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    order_nr?: string;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    remarks?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    discount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    transport?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ValidateIf((_, value) => value !== undefined)
    is_gift?: boolean;

  @ApiProperty()
  @IsString()
    discr: string;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    external_id?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    status_id?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    customer_id?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    supplier_id?: number;

  @ApiPropertyOptional()
  @Type(() => CreatePickupUncheckedWithoutAorderInputDto)
    pickup?: CreatePickupUncheckedWithoutAorderInputDto;

  @ApiPropertyOptional()
  @Type(() => CreateDeliveryUncheckedWithoutAorderInputDto)
    delivery?: CreateDeliveryUncheckedWithoutAorderInputDto;

  @ApiPropertyOptional()
    afile?: Prisma.afileCreateNestedManyWithoutAorderInput;

  @ApiPropertyOptional()
    aorder?: Prisma.aorderCreateNestedOneWithoutOther_aorderInput;

  @ApiPropertyOptional()
    other_aorder?: Prisma.aorderCreateNestedManyWithoutAorderInput;

  @ApiPropertyOptional()
    product_order?: Prisma.product_orderCreateNestedManyWithoutAorderInput;

  @ApiPropertyOptional()
  @Type(() => CreateRepairUncheckedWithoutAOrderInputDto)
    repair?: CreateRepairUncheckedWithoutAOrderInputDto;
}
