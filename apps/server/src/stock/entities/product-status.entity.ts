import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { product_status } from "@prisma/client";

export class ProductStatusEntity implements product_status {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  is_stock: boolean | null;

  @ApiPropertyOptional()
  is_saleable: boolean | null;

  @ApiPropertyOptional()
  pindex: number | null;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  color: string | null;
}
