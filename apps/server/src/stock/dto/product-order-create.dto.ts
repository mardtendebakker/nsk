import {
  ApiProperty, ApiPropertyOptional, OmitType, PartialType,
} from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { formDataNumberTransform } from '../../common/transforms/form-data.transform';
import { ProductOrderEntity } from '../entities/product-order.entity';

export class ProductOrderCreateDto extends PartialType(OmitType(ProductOrderEntity, ['id', 'product_id'])) {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
    order_id: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
    quantity?: number | null;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
    price?: number | null;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
    external_id?: number | null;
}
