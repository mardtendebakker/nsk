import { contact } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ContactEntity implements contact {
  @ApiProperty()
    id: number;

  @ApiProperty()
    company_id: number;

  @ApiPropertyOptional()
    name: string | null;

  @ApiPropertyOptional()
    email: string | null;

  @ApiPropertyOptional()
    phone: string | null;

  @ApiPropertyOptional()
    phone2: string | null;

  @ApiPropertyOptional()
    street: string | null;

  @ApiPropertyOptional()
    street_extra: string | null;

  @ApiPropertyOptional()
    city: string | null;

  @ApiPropertyOptional()
    country: string | null;

  @ApiPropertyOptional()
    state: string | null;

  @ApiPropertyOptional()
    zip: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
    exact_id: string | null;

  @ApiPropertyOptional()
    street2: string | null;

  @ApiPropertyOptional()
    street_extra2: string | null;

  @ApiPropertyOptional()
    city2: string | null;

  @ApiPropertyOptional()
    country2: string | null;

  @ApiPropertyOptional()
    state2: string | null;

  @ApiPropertyOptional()
    zip2: string | null;

  @ApiPropertyOptional()
    is_main: boolean | null;

  @ApiPropertyOptional()
    external_id: number | null;
}
