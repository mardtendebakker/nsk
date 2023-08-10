import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ProductAttributeDto } from "./product-attribute.dto";
import { formDataNumberTransform, formDataStringTransform } from "../../common/transforms/form-date.transform";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { ProductOrderCreateDto } from "./product-order-create.dto";

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
