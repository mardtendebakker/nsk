import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsNumber, IsOptional, IsString,
} from 'class-validator';
import { formDataDateTransform, formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-date.transform';

export class PrismaAOrderCreateInputDto implements Prisma.aorderCreateInput {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsString()
  @IsOptional()
    order_nr?: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsString()
  @IsOptional()
    remarks?: string;

  @ApiProperty()
  @Transform(formDataDateTransform)
  @IsString()
  @Type(() => Date)
    order_date: Date;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
    discount?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
    transport?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
    is_gift?: boolean;

  @ApiProperty()
  @IsString()
    discr: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    external_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
    vat_rate?: number;

  @ApiPropertyOptional()
    contact_aorder_supplier_idTocontact?: Prisma.contactCreateNestedOneWithoutSupplierOrdersInput;

  @ApiPropertyOptional()
    order_status?: Prisma.order_statusCreateNestedOneWithoutAorderInput;

  @ApiPropertyOptional()
    contact_aorder_customer_idTocontact?: Prisma.contactCreateNestedOneWithoutCustomerOrdersInput;

  @ApiPropertyOptional()
    aorder?: Prisma.aorderCreateNestedOneWithoutOther_aorderInput;

  @ApiPropertyOptional()
    other_aorder?: Prisma.aorderCreateNestedManyWithoutAorderInput;

  @ApiPropertyOptional()
    delivery?: Prisma.deliveryCreateNestedOneWithoutAorderInput;

  @ApiPropertyOptional()
    pickup?: Prisma.pickupCreateNestedOneWithoutAorderInput;

  @ApiPropertyOptional()
    product_order?: Prisma.product_orderCreateNestedManyWithoutAorderInput;

  @ApiPropertyOptional()
    repair?: Prisma.repairCreateNestedOneWithoutAorderInput;
}
