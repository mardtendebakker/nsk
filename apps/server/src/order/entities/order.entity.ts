import { aorder } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderEntity implements aorder {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  status_id: number;

  @ApiPropertyOptional()
  customer_id: number;

  @ApiPropertyOptional()
  supplier_id: number;

  @ApiPropertyOptional()
  order_nr: string;

  @ApiPropertyOptional()
  remarks: string;

  @ApiProperty()
  order_date: Date;

  @ApiPropertyOptional()
  discount: number;

  @ApiPropertyOptional()
  transport: number;

  @ApiPropertyOptional()
  is_gift: boolean;

  @ApiProperty()
  discr: string;

  @ApiPropertyOptional()
  backingPurchaseOrder_id: number;

  @ApiPropertyOptional()
  external_id: number;

  @ApiPropertyOptional()
  delivery_type: number;

  @ApiPropertyOptional()
  delivery_date: Date;

  @ApiPropertyOptional()
  delivery_instructions: string; 
}
