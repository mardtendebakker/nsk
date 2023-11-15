import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsOptional } from "class-validator";
import { IsPartner } from "../types/is-partner.enum";

export class PrismaContactCreateInputDto implements Prisma.contactUncheckedCreateInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  partner_id?: number;

  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  kvk_nr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  representative?: string;

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

  @ApiPropertyOptional({
    enum: IsPartner,
    enumName: 'IsPartner',
  })
  @IsOptional()
  @IsEnum(IsPartner)
  @Type(() => Number)
  is_partner?: IsPartner;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  external_id?: number;

  @ApiPropertyOptional()
  other_contact?: Prisma.contactUncheckedCreateNestedManyWithoutContactInput;

  @ApiPropertyOptional()
  supplierOrders?: Prisma.aorderUncheckedCreateNestedManyWithoutContact_aorder_supplier_idTocontactInput;

  @ApiPropertyOptional()
  customerOrders?: Prisma.aorderUncheckedCreateNestedManyWithoutContact_aorder_customer_idTocontactInput;

  @ApiPropertyOptional()
  fos_user?: Prisma.fos_userUncheckedCreateNestedManyWithoutContactInput;

  @ApiPropertyOptional()
  product?: Prisma.productUncheckedCreateNestedManyWithoutContactInput;
}