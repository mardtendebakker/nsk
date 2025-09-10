import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaContactUpdateInputDto } from './prisma-contact-update-input.dto';

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
  @IsInt()
  @Type(() => Number)
    company_rsin_nr?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
    company_is_partner?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
    company_is_customer?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
    company_is_supplier?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_partner_id?: number;
}
