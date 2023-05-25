import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { product_attribute } from "@prisma/client";

export class ProductAttributeEntity implements product_attribute {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  attribute_id: number;

  @ApiPropertyOptional()
  value_product_id: number | null;

  @ApiProperty()
  value: string;

  @ApiPropertyOptional()
  quantity: number | null;

  @ApiPropertyOptional()
  external_id: number | null;
}
