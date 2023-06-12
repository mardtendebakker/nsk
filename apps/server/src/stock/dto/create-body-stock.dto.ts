import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ProductAttributeFormDto } from "./product-attribute-form.dto";
import { formDataNumberTransform, formDataStringTransform } from "../../common/transforms/form-date.transform";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { ProductOrderFormDto } from "./product-order-form.dto";

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
  @IsNumber()
  @Type(() => Number)
  external_id?: number;
  
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status_id?: number;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  location_id: number;
  
  @ApiPropertyOptional()
  @Type(() => ProductAttributeFormDto)
  product_attributes?: ProductAttributeFormDto[];
  
  @ApiPropertyOptional()
  @Type(() => ProductOrderFormDto)
  product_orders?: ProductOrderFormDto[];
  
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  owner_id?: number;
}
