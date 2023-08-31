import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { AOrderEntity } from "../entities/aorder.entity";
import { ProductOrderEntity } from "../../stock/entities/product-order.entity";
import { ProductEntity } from "../../stock/entities/product.entity";
import { OrderStatusEntity } from "../../order-status/entities/order-status.entity";
import { CompanyEntity } from "../../company/entities/company.entity";

class OrderStatus extends PickType(OrderStatusEntity, [
  'id',
  'name',
  'color',
]) {}

class ACompany extends PickType(CompanyEntity, [
  'id',
  'name',
  'street',
  'city',
]) {}

class Company extends PickType(CompanyEntity, [
  'id',
  'name',
  'street',
  'city',
]) {
  @ApiPropertyOptional()
  acompany?: ACompany;
}

class ProductDto extends PickType(ProductEntity, [
  'name'
]) {}

export class ProductOrderDto extends PickType(ProductOrderEntity, [
  'quantity',
]) {
  @ApiPropertyOptional()
  product?: ProductDto;
}

class FindAOrderResponeDto extends PickType(AOrderEntity, [
  "id",
  "order_nr",
  "order_date",
] as const) {
  @ApiPropertyOptional()
  order_status?: OrderStatus;

  @ApiPropertyOptional()
  acompany_aorder_supplier_idToacompany?: Company;

  @ApiPropertyOptional()
  acompany_aorder_customer_idToacompany?: Company;

  @ApiPropertyOptional()
  product_orders?: ProductOrderDto[];
}

export class FindAOrdersResponeDto implements IFindManyRespone<FindAOrderResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindAOrderResponeDto[]
}
