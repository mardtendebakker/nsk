import { aorder } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AOrderEntity implements aorder {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  status_id: number | null;

  @ApiPropertyOptional()
  customer_id: number | null;

  @ApiPropertyOptional()
  supplier_id: number | null;

  @ApiPropertyOptional()
  order_nr: string | null;

  @ApiPropertyOptional()
  remarks: string | null;

  @ApiProperty()
  order_date: Date;

  @ApiPropertyOptional()
  discount: number | null;

  @ApiPropertyOptional()
  transport: number | null;

  @ApiPropertyOptional()
  is_gift: boolean | null;

  @ApiProperty()
  discr: string;

  @ApiPropertyOptional()
  backingPurchaseOrder_id: number | null;

  @ApiPropertyOptional()
  external_id: number | null;

  @ApiPropertyOptional()
  delivery_type: number | null;

  @ApiPropertyOptional()
  delivery_date: Date | null;

  @ApiPropertyOptional()
  delivery_instructions: string | null; 
}
