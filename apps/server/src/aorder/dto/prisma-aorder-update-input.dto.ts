import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaAOrderUpdateInputDto implements Prisma.aorderUpdateInput {
  @ApiPropertyOptional()
  order_nr: string | Prisma.NullableStringFieldUpdateOperationsInput;

  @ApiPropertyOptional()
  remarks?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  order_date?: string | Date | Prisma.DateTimeFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  discount?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  transport?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  is_gift?: boolean | Prisma.NullableBoolFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  discr?: string | Prisma.StringFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  external_id?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  delivery_type?: number | Prisma.NullableIntFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  delivery_date?: string | Date | Prisma.NullableDateTimeFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  delivery_instructions?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  
  @ApiPropertyOptional()
  afile?: Prisma.afileUpdateManyWithoutAorderNestedInput;
  
  @ApiPropertyOptional()
  acompany_aorder_supplier_idToacompany?: Prisma.acompanyUpdateOneWithoutSupplierOrdersNestedInput;
  
  @ApiPropertyOptional()
  aorder?: Prisma.aorderUpdateOneWithoutOther_aorderNestedInput;
  
  @ApiPropertyOptional()
  other_aorder?: Prisma.aorderUpdateManyWithoutAorderNestedInput;
  
  @ApiPropertyOptional()
  order_status?: Prisma.order_statusUpdateOneWithoutAorderNestedInput;
  
  @ApiPropertyOptional()
  acompany_aorder_customer_idToacompany?: Prisma.acompanyUpdateOneWithoutCustomerOrdersNestedInput;
  
  @ApiPropertyOptional()
  pickup?: Prisma.pickupUpdateOneWithoutAorderNestedInput;
  
  @ApiPropertyOptional()
  product_order?: Prisma.product_orderUpdateManyWithoutAorderNestedInput;
  
  @ApiPropertyOptional()
  repair?: Prisma.repairUpdateOneWithoutAorderNestedInput;
}
