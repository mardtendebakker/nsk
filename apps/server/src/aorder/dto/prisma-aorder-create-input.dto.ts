import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaAOrderCreateInputDto implements Prisma.aorderCreateInput {
  @ApiPropertyOptional()
  order_nr?: string;

  @ApiPropertyOptional()
  remarks?: string;
  
  @ApiProperty()
  order_date: string | Date;

  @ApiPropertyOptional()
  discount?: number;
  
  @ApiPropertyOptional()
  transport?: number;
  
  @ApiPropertyOptional()
  is_gift?: boolean;
  
  @ApiProperty()
  discr: string;
  
  @ApiPropertyOptional()
  external_id?: number;
  
  @ApiPropertyOptional()
  delivery_type?: number;
  
  @ApiPropertyOptional()
  delivery_date?: string | Date;
  
  @ApiPropertyOptional()
  delivery_instructions?: string;
  
  @ApiPropertyOptional()
  afile?: Prisma.afileCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  acompany_aorder_supplier_idToacompany?: Prisma.acompanyCreateNestedOneWithoutSupplierOrdersInput;
  
  @ApiPropertyOptional()
  aorder?: Prisma.aorderCreateNestedOneWithoutOther_aorderInput;
  
  @ApiPropertyOptional()
  other_aorder?: Prisma.aorderCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  order_status?: Prisma.order_statusCreateNestedOneWithoutAorderInput;
  
  @ApiPropertyOptional()
  acompany_aorder_customer_idToacompany?: Prisma.acompanyCreateNestedOneWithoutCustomerOrdersInput;
  
  @ApiPropertyOptional()
  pickup?: Prisma.pickupCreateNestedOneWithoutAorderInput;
  
  @ApiPropertyOptional()
  product_order?: Prisma.product_orderCreateNestedManyWithoutAorderInput;
  
  @ApiPropertyOptional()
  repair?: Prisma.repairCreateNestedOneWithoutAorderInput;
}
