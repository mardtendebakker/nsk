import { ApiProperty } from '@nestjs/swagger';

export class ProductLogEntity {
  @ApiProperty()
    id: number;

  @ApiProperty()
    product_id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    sku: string;

  @ApiProperty()
    order_nr: string;

  @ApiProperty({ enum: ['delete', 'add', 'update'] })
    action: string;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}
