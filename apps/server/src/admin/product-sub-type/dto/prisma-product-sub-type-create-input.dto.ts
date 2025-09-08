import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PrismaProductSubTypeCreateInputDto implements Prisma.product_sub_typeUncheckedCreateInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    id?: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
    product_type_id: number;

  @ApiProperty()
  @IsString()
  @Type(() => String)
    name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
    magento_category_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
    magento_attr_set_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
    magento_group_spec_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    pindex?: number;
}
