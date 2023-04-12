import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class UpdateStockDto implements Prisma.productUpdateInput {
  @ApiPropertyOptional()
  sku: string | Prisma.StringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  description?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  price?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  created_at?: string | Date | Prisma.DateTimeFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  updated_at?: string | Date | Prisma.DateTimeFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  external_id?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
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
