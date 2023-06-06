import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { pickup } from "@prisma/client";

export class PickupEntity implements pickup {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  order_id: number | null;
  
  @ApiPropertyOptional()
  logistics_id: number | null;
  
  @ApiPropertyOptional()
  pickup_date: Date | null;
  
  @ApiPropertyOptional()
  real_pickup_date: Date | null;
  
  @ApiPropertyOptional()
  origin: string | null;
  
  @ApiPropertyOptional()
  data_destruction: number | null;
  
  @ApiPropertyOptional()
  description: string | null;
}
