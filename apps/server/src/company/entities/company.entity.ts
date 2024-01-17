import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { company } from "@prisma/client";

export class CompanyEntity implements company {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional()
  kvk_nr: number | null;

  @ApiProperty()
  is_partner: boolean;

  @ApiProperty()
  is_supplier: boolean;

  @ApiProperty()
  is_customer: boolean;

  @ApiPropertyOptional()
  partner_id: number | null;
}
