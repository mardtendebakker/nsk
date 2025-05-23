import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

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

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
    is_partner: boolean;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
    is_customer: boolean;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
    is_supplier: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
    partner_id?: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
    vat_code: number;
}
