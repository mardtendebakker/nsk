import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaCompanyUpdateInputDto implements Prisma.acompanyUpdateInput {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  kvk_nr?: number;
  
  @ApiPropertyOptional()
  representative?: string;
  
  @ApiPropertyOptional()
  email?: string;
  
  @ApiPropertyOptional()
  phone?: string;
  
  @ApiPropertyOptional()
  phone2?: string;
  
  @ApiPropertyOptional()
  street?: string;
  
  @ApiPropertyOptional()
  street_extra?: string;
  
  @ApiPropertyOptional()
  city?: string;
  
  @ApiPropertyOptional()
  country?: string;
  
  @ApiPropertyOptional()
  state?: string;
  
  @ApiPropertyOptional()
  zip?: string;
  
  @ApiPropertyOptional()
  street2?: string;
  
  @ApiPropertyOptional()
  street_extra2?: string;
  
  @ApiPropertyOptional()
  city2?: string;
  
  @ApiPropertyOptional()
  country2?: string;
  
  @ApiPropertyOptional()
  state2?: string;
  
  @ApiPropertyOptional()
  zip2?: string;
  
  @ApiPropertyOptional()
  discr?: string;
  
  @ApiPropertyOptional()
  is_partner?: number;
  
  @ApiPropertyOptional()
  external_id?: number;
  
  @ApiPropertyOptional()
  acompany?: Prisma.acompanyUpdateOneWithoutOther_acompanyNestedInput;
  
  @ApiPropertyOptional()
  other_acompany?: Prisma.acompanyUpdateManyWithoutAcompanyNestedInput;
  
  @ApiPropertyOptional()
  supplierOrders?: Prisma.aorderUpdateManyWithoutAcompany_aorder_supplier_idToacompanyNestedInput;
  
  @ApiPropertyOptional()
  customerOrders?: Prisma.aorderUpdateManyWithoutAcompany_aorder_customer_idToacompanyNestedInput;
  
  @ApiPropertyOptional()
  fos_user?: Prisma.fos_userUpdateManyWithoutAcompanyNestedInput;
  
  @ApiPropertyOptional()
  product?: Prisma.productUpdateManyWithoutAcompanyNestedInput;
}
