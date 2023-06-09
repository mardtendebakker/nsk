import { acompany } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyEntity implements acompany {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  partner_id: number | null;

  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional()
  kvk_nr: number | null;
  
  @ApiPropertyOptional()
  representative: string | null;
  
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
  
  @ApiProperty()
  discr: string;
  
  @ApiPropertyOptional()
  is_partner: number | null;
  
  @ApiPropertyOptional()
  external_id: number | null;
}
