import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PrismaCompanyCreateInputDto implements Prisma.companyUncheckedCreateInput {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    kvk_nr?: number;

    @ApiPropertyOptional()
    contact_contact_company_idTocompany?: Prisma.contactUncheckedCreateNestedManyWithoutCompany_contact_company_idTocompanyInput;
}
