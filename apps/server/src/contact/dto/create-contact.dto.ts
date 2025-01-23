import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaContactCreateInputDto } from './prisma-contact-create-input.dto';

export class CreateContactDto extends OmitType(PrismaContactCreateInputDto, [
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
  @IsInt()
  @Type(() => Number)
    company_tax_code?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
    company_is_partner?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
    company_is_customer?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
    company_is_supplier?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_partner_id?: number;
}
