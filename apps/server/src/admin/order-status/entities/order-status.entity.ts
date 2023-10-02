import { order_status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderStatusEntity implements order_status {
  @ApiProperty()
  id: number;

  @ApiProperty()
  is_sale: boolean;

  @ApiProperty()
  is_purchase: boolean;
  
  @ApiPropertyOptional()
  pindex: number|null;
  
  @ApiProperty()
  name: string;
  
  @ApiPropertyOptional()
  color: string|null;
  
  @ApiPropertyOptional()
  mailbody: string|null;
}
