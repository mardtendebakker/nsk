import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';
import { AOrderEntity } from '../entities/aorder.entity';
import { ProductOrderEntity } from '../../stock/entities/product-order.entity';
import { ProductEntity } from '../../stock/entities/product.entity';
import { OrderStatusEntity } from '../../admin/order-status/entities/order-status.entity';
import { ContactEntity } from '../../contact/entities/contact.entity';

class OrderStatus extends PickType(OrderStatusEntity, [
  'id',
  'name',
  'color',
]) {}

class SubContact extends PickType(ContactEntity, [
  'id',
  'street',
  'city',
  'zip',
]) {
  @ApiProperty()
    name: string;
}

class Contact extends PickType(ContactEntity, [
  'id',
  'street',
  'city',
  'zip',
]) {
  @ApiProperty()
    name: string;

  @ApiPropertyOptional()
    contact?: SubContact;
}

class ProductDto extends PickType(ProductEntity, [
  'name',
]) {}

export class ProductOrderDto extends PickType(ProductOrderEntity, [
  'quantity',
]) {
  @ApiPropertyOptional()
    product?: ProductDto;
}

class FindAOrderResponeDto extends PickType(AOrderEntity, [
  'id',
  'order_nr',
  'order_date',
] as const) {
  @ApiPropertyOptional()
    order_status?: OrderStatus;

  @ApiPropertyOptional()
    contact_aorder_supplier_idTocontact?: Contact;

  @ApiPropertyOptional()
    contact_aorder_customer_idTocontact?: Contact;

  @ApiPropertyOptional()
    product_orders?: ProductOrderDto[];
}

export class FindAOrdersResponeDto implements IFindManyRespone<FindAOrderResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindAOrderResponeDto[];
}
