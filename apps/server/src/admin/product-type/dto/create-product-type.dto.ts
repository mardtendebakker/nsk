import { OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PrismaProductTypeCreateInputDto } from './prisma-product-type-create-input.dto';

export class CreateProductTypeDto extends OmitType(PrismaProductTypeCreateInputDto, [
  'attribute',
  'product',
  'product_type_attribute',
  'product_type_task',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id, 10)) : parseInt(value, 10)))
    attributes: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id, 10)) : parseInt(value, 10)))
    tasks: number[];
}
