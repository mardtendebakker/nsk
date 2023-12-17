import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PrismaContactCreateInputDto } from './prisma-contact-create-input.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContactDto extends OmitType(PrismaContactCreateInputDto, [
  'supplierOrders',
  'customerOrders',
  'company_contact_company_idTocompany',
  'fos_user',
  'product',
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
}
