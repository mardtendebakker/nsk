import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { product_order } from "@prisma/client";

export class ProductOrderEntity implements product_order {
  @ApiProperty()
  id: number;

  @ApiProperty()
  product_id: number | null;
  
  @ApiProperty()
  order_id: number;
  
  @ApiPropertyOptional()
  quantity: number | null;
  
  @ApiPropertyOptional()
  price: number | null;
  
  @ApiPropertyOptional()
  external_id: number | null;
}
