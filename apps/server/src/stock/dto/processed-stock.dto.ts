import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { aservice } from '@prisma/client';
import { ProcessedTask } from './processed-task.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductOrderPayload } from '../types/product-order-payload';
import { ProductOrderRelationOrder } from './product-order-relation-order.dto';

export class ProcessedStock extends PickType(ProductEntity, [
  'id',
  'sku',
  'name',
  'price',
  'created_at',
  'updated_at',
] as const) {
  @ApiProperty()
    status: string;

  @ApiProperty()
    entity: string;

  @ApiProperty()
    type: string;

  @ApiProperty()
    location: string;

  @ApiProperty()
    purch: number;

  @ApiProperty()
    stock: number;

  @ApiProperty()
    hold: number;

  @ApiProperty()
    sale: number;

  @ApiProperty()
    sold: number;

  @ApiProperty()
    order_date: Date;

  @ApiProperty()
    order_nr: string;

  @ApiProperty()
    tasks: ProcessedTask[];

  @ApiProperty()
    splittable: boolean;

  @ApiPropertyOptional()
    attributedProducts?: Pick<ProductEntity, 'price'>[];

  @ApiPropertyOptional()
    product_order?: ProductOrderPayload;

  @ApiProperty()
    product_orders?: ProductOrderRelationOrder[];

  @ApiPropertyOptional()
    services?: aservice[];
}
