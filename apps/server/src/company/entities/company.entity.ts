import { acompany } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AcompanyEntity implements acompany {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  partner_id: number;

  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional()
  kvk_nr: number;
  
  @ApiPropertyOptional()
  representative: string;
  
  @ApiPropertyOptional()
  email: string;
  
  @ApiPropertyOptional()
  phone: string;
  
  @ApiPropertyOptional()
  phone2: string;
  
  @ApiPropertyOptional()
  street: string;
  
  @ApiPropertyOptional()
  street_extra: string;
  
  @ApiPropertyOptional()
  city: string;
  
  @ApiPropertyOptional()
  country: string;
  
  @ApiPropertyOptional()
  state: string;
  
  @ApiPropertyOptional()
  zip: string;
  
  @ApiPropertyOptional()
  street2: string;
  
  @ApiPropertyOptional()
  street_extra2: string;
  
  @ApiPropertyOptional()
  city2: string;
  
  @ApiPropertyOptional()
  country2: string;
  
  @ApiPropertyOptional()
  state2: string;
  
  @ApiPropertyOptional()
  zip2: string;
  
  @ApiProperty()
  discr: string;
  
  @ApiPropertyOptional()
  is_partner: number;
  
  @ApiPropertyOptional()
  external_id: number;
}
