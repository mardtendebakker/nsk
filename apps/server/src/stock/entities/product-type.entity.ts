import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { product_type } from "@prisma/client";

export class ProductTypeEntity implements product_type {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  pindex: number | null;

  @ApiPropertyOptional()
  comment: string | null;

  @ApiProperty()
  is_attribute: boolean;

  @ApiPropertyOptional()
  external_id: number | null;
}
