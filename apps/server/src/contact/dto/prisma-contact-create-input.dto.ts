import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsOptional, Max, Min } from "class-validator";

export class PrismaContactCreateInputDto implements Prisma.contactCreateInput {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional()
  @IsOptional()
  street_extra?: string;

  @ApiPropertyOptional()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  zip?: string;

  @ApiPropertyOptional()
  @IsOptional()
  street2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  street_extra2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  city2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  country2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  state2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  zip2?: string;

  @ApiProperty()
  discr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(1)
  is_partner?: number;


  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_main?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  external_id?: number;

  @ApiPropertyOptional()
  supplierOrders?: Prisma.aorderUncheckedCreateNestedManyWithoutContact_aorder_supplier_idTocontactInput;

  @ApiPropertyOptional()
  customerOrders?: Prisma.aorderUncheckedCreateNestedManyWithoutContact_aorder_customer_idTocontactInput;

  @ApiPropertyOptional()
  contact?: Prisma.contactCreateNestedOneWithoutOther_contactInput;

  @ApiPropertyOptional()
  other_contact?: Prisma.contactUncheckedCreateNestedManyWithoutContactInput;

  @ApiProperty()
  company_contact_company_idTocompany: Prisma.companyCreateNestedOneWithoutContact_contact_company_idTocompanyInput;

  @ApiPropertyOptional()
  fos_user?: Prisma.fos_userUncheckedCreateNestedManyWithoutContactInput;

  @ApiPropertyOptional()
  product?: Prisma.productUncheckedCreateNestedManyWithoutContactInput;
}
