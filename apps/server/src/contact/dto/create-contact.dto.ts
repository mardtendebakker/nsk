import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PrismaContactCreateInputDto } from './prisma-contact-create-input.dto';
import { formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-date.transform';

export class CreateContactDto extends OmitType(PrismaContactCreateInputDto, [
  'supplierOrders',
  'customerOrders',
  'company_contact_company_idTocompany',
] as const) {
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_id?: number;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
    company_name?: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_kvk_nr?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_vat_code?: number;

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
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    company_partner_id?: number;
}
