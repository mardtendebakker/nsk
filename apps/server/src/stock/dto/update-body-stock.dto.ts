import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { Transform } from "class-transformer";
import { TransformFnParams } from "class-transformer";

export class ProductAttributeUpdateDto extends OmitType(ProductAttributeEntity, ['product_id']) {}

export class UpdateBodyStockDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({value}) => JSON.parse(value))
  description?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({value}) => JSON.parse(value))
  price?: number | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  external_id?: number;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number;
  
  @ApiPropertyOptional()
  @Type(() => ProductAttributeUpdateDto)
  product_attributes?: ProductAttributeUpdateDto[];
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  owner_id?: number;
}
