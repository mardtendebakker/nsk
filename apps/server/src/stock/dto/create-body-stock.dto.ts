import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ProductAttributeDto } from './product-attribute.dto';
import {
  formDataNumberTransform,
  formDataStringTransform,
} from '../../common/transforms/form-date.transform';
import { IsOptional, IsString, IsNumber, IsEnum, IsInt } from 'class-validator';
import { ProductOrderCreateDto } from './product-order-create.dto';
import { EntityStatus } from '../../common/types/entity-status.enum';

export class CreateBodyStockDto {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number | null;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  external_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  type_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  status_id?: number;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
  location_id: number;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  location_label?: string;

  @ApiPropertyOptional({
    enum: EntityStatus,
    enumName: 'EntityStatus',
  })
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsEnum(EntityStatus)
  @Type(() => Number)
  entity_status?: EntityStatus;

  @ApiPropertyOptional()
  @Type(() => ProductAttributeDto)
  product_attributes?: ProductAttributeDto[];

  @ApiPropertyOptional()
  @Type(() => ProductOrderCreateDto)
  product_orders?: ProductOrderCreateDto[];

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  owner_id?: number;
}
