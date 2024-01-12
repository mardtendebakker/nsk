import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { PrismaContactUpdateInputDto } from "./prisma-contact-update-input.dto";
import { IsBoolean, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateContactDto extends OmitType(PrismaContactUpdateInputDto, [
    'supplierOrders',
    'customerOrders',
    'company_contact_company_idTocompany',
  ] as const) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    company_id?: number;
  
    @ApiPropertyOptional()
    @IsOptional()
    company_name?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    company_kvk_nr?: number;

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
  }
  
