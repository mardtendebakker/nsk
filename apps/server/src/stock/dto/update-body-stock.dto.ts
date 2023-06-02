import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ProductAttributeFormDto } from "./product-attribute-form.dto";
import { formDataToNullTransform, formDataToStringTransform } from "../../common/transforms/form-date.transform";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class ProductAttributeUpdateDto extends OmitType(ProductAttributeFormDto, ['product_id']) {}

export class UpdateBodyStockDto {
  @ApiPropertyOptional()
  @Transform(formDataToStringTransform)
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @Transform(formDataToStringTransform)
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional()
  @Transform(formDataToStringTransform)
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number | null;
  
  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  external_id?: number;
  
  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id?: number;
  
  @ApiPropertyOptional()
  @Type(() => ProductAttributeFormDto)
  product_attributes?: ProductAttributeFormDto[];
  
  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  owner_id?: number;
}
