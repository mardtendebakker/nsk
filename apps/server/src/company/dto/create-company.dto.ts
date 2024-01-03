import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PrismaCompanyCreateInputDto } from './prisma-company-create-input.dto';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto extends OmitType(PrismaCompanyCreateInputDto, ['id'] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  kvk_nr?: number;

  @ApiProperty()
  @IsBoolean()
  is_partner: boolean;

  @ApiProperty()
  @IsBoolean()
  is_customer: boolean;

  @ApiProperty()
  @IsBoolean()
  is_supplier: boolean;
}
