import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaCompanyCreateInputDto implements Prisma.acompanyCreateInput {
  @ApiProperty()
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

  @ApiProperty()
  discr: string;
  
  @ApiPropertyOptional()
  is_partner?: number;

  @ApiPropertyOptional()
  external_id?: number;

  @ApiPropertyOptional()
  acompany?: Prisma.acompanyCreateNestedOneWithoutOther_acompanyInput;

  @ApiPropertyOptional()
  other_acompany?: Prisma.acompanyCreateNestedManyWithoutAcompanyInput;

  @ApiPropertyOptional()
  supplierOrders?: Prisma.aorderCreateNestedManyWithoutAcompany_aorder_supplier_idToacompanyInput;

  @ApiPropertyOptional()
  customerOrders?: Prisma.aorderCreateNestedManyWithoutAcompany_aorder_customer_idToacompanyInput;

  @ApiPropertyOptional()
  fos_user?: Prisma.fos_userCreateNestedManyWithoutAcompanyInput;

  @ApiPropertyOptional()
  product?: Prisma.productCreateNestedManyWithoutAcompanyInput;
}
