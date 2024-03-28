import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsOptional, IsString,
} from 'class-validator';

export class PrismaProductTypeCreateInputDto implements Prisma.product_typeCreateInput {
  @ApiProperty()
  @IsString()
  @Type(() => String)
    name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    pindex?: number;

  @ApiProperty()
  @IsString()
  @Type(() => String)
    comment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === null ? false : value))
    is_attribute?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === null ? false : value))
    is_public?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    external_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
    attribute?: Prisma.attributeCreateNestedManyWithoutProduct_typeInput;

  @ApiPropertyOptional()
  @IsOptional()
    product?: Prisma.productCreateNestedManyWithoutProduct_typeInput;

  @ApiPropertyOptional()
  @IsOptional()
    product_type_attribute?: Prisma.product_type_attributeCreateNestedManyWithoutProduct_typeInput;

  4;

  @ApiPropertyOptional()
  @IsOptional()
    product_type_task?: Prisma.product_type_taskCreateNestedManyWithoutProduct_typeInput;
}
