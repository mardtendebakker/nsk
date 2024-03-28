import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsNumber, IsString, ValidateIf,
} from 'class-validator';

export class PrismaAttributeCreateInputDto implements Prisma.attributeCreateInput {
  @ApiProperty()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    name: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    attr_code: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    type?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
    has_quantity?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    external_id?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @ValidateIf((_, value) => value !== undefined)
    is_public?: boolean;

  @ApiPropertyOptional()
    product_type?: Prisma.product_typeCreateNestedOneWithoutAttributeInput;

  @ApiPropertyOptional()
    attribute_option?: Prisma.attribute_optionCreateNestedManyWithoutAttributeInput;

  @ApiPropertyOptional()
    product_attribute?: Prisma.product_attributeCreateNestedManyWithoutAttributeInput;

  @ApiPropertyOptional()
    product_type_attribute?: Prisma.product_type_attributeCreateNestedManyWithoutAttributeInput;
}
