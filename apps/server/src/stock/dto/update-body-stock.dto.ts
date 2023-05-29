import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";

class ProductAttributeDto extends OmitType(ProductAttributeEntity, ['product_id']) {}

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
  description?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;
  
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
  @IsNumber({}, {each: true})
  file_ids?: number[];
  
  @ApiPropertyOptional()
  product_attributes?: ProductAttributeDto[];
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  owner_id?: number;
}
