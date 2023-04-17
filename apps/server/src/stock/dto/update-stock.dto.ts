import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStockDto implements Prisma.productUpdateInput {
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
  price?: number;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  external_id?: number;
  
  @ApiPropertyOptional()
  afile?: Prisma.afileUpdateManyWithoutProductNestedInput;
  
  @ApiPropertyOptional()
  location?: Prisma.locationUpdateOneRequiredWithoutProductNestedInput;
  
  @ApiPropertyOptional()
  product_status?: Prisma.product_statusUpdateOneWithoutProductNestedInput;
  
  @ApiPropertyOptional()
  acompany?: Prisma.acompanyUpdateOneWithoutProductNestedInput;
  
  @ApiPropertyOptional()
  product_type?: Prisma.product_typeUpdateOneWithoutProductNestedInput;
  
  @ApiPropertyOptional()
  product_attribute_product_attribute_product_idToproduct?: Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_product_idToproductNestedInput;
  
  @ApiPropertyOptional()
  product_attribute_product_attribute_value_product_idToproduct?: Prisma.product_attributeUpdateManyWithoutProduct_product_attribute_value_product_idToproductNestedInput;
  
  @ApiPropertyOptional()
  product_order?: Prisma.product_orderUpdateManyWithoutProductNestedInput;
}
