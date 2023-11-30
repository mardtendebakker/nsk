import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PrismaCompanyCreateInputDto } from './prisma-company-create-input.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto extends OmitType(PrismaCompanyCreateInputDto, ['id','contact_contact_company_idTocompany'] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  kvk_nr?: number;
}
