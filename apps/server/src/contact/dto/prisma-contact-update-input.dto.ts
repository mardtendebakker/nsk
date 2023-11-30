import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsInt, IsOptional, Max, Min } from "class-validator";

export class PrismaContactUpdateInputDto implements Prisma.contactUpdateInput {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_partner?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_customer?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_supplier?: boolean;


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
  supplierOrders?: Prisma.aorderUpdateManyWithoutContact_aorder_supplier_idTocontactNestedInput;

  @ApiPropertyOptional()
  customerOrders?: Prisma.aorderUpdateManyWithoutContact_aorder_customer_idTocontactNestedInput;

  @ApiPropertyOptional()
  contact?: Prisma.contactUpdateOneWithoutOther_contactNestedInput;

  @ApiPropertyOptional()
  other_contact?: Prisma.contactUpdateManyWithoutContactNestedInput;

  @ApiProperty()
  company_contact_company_idTocompany?: Prisma.companyUpdateOneRequiredWithoutContact_contact_company_idTocompanyNestedInput;

  @ApiPropertyOptional()
  fos_user?: Prisma.fos_userUpdateManyWithoutContactNestedInput;

  @ApiPropertyOptional()
  product?: Prisma.productUpdateManyWithoutContactNestedInput;
}
