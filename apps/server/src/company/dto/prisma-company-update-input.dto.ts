import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional } from "class-validator";

export class PrismaCompanyUpdateInputDto implements Prisma.companyUncheckedUpdateInput {
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

    @ApiPropertyOptional()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    kvk_nr?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_customer?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_supplier?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_partner?: boolean;

    @ApiPropertyOptional()
    other_company?: Prisma.companyUncheckedUpdateManyWithoutCompanyNestedInput;

    @ApiPropertyOptional()
    companyContacts?: Prisma.contactUncheckedUpdateManyWithoutCompany_contact_company_idTocompanyNestedInput;
}
