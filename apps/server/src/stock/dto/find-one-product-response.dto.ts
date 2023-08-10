import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { FileEntity } from "../../file/entities/file.entity";
import { LocationEntity } from "../../location/entities/location.entity";
import { ProductOrderEntity } from "../entities/product-order.entity";
import { ProductStatusEntity } from "../entities/product-status.entity";
import { ProductTypeEntity } from "../entities/product-type.entity";
import { ProductEntity } from "../entities/product.entity";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { AOrderEntity } from "../../aorder/entities/aorder.entity";
import { OrderStatusEntity } from "../../order-status/entities/order-status.entity";
import { CompanyEntity } from "../../company/entities/company.entity";

class ProductAttributeDto extends PickType(ProductAttributeEntity, [
  'quantity',
  'attribute_id',
  'value'
]) {}

class OrderStatusDto extends PickType(OrderStatusEntity, [
  'name'
]) {}

class CompanyDto extends PickType(CompanyEntity, ['name']) {}

class AOrderDto extends PickType(AOrderEntity, [
  'id',
  'order_nr',
  'order_date'
]) {
  @ApiProperty()
  acompany_aorder_customer_idToacompany: CompanyDto;

  @ApiProperty()
  acompany_aorder_supplier_idToacompany: CompanyDto;

  @ApiProperty()
  order_status: OrderStatusDto;
}

class ProductOrderDto extends PickType(ProductOrderEntity, [
  'quantity',
  'price'
]) {
  @ApiPropertyOptional()
  aorder?: AOrderDto[]
}

class FileDto extends PickType(FileEntity, [
  'id',
  'unique_server_filename',
  'original_client_filename',
  'discr',
]) {}

class LocationDto extends PickType(LocationEntity, [
  'id',
  'name'
]) {}

class ProductStatusDto extends PickType(ProductStatusEntity, [
  'id',
  'name'
]) {}

class ProductTypeDto extends PickType(ProductTypeEntity, [
  'id',
  'name'
]) {}

export class FindOneProductResponeDto extends PickType(ProductEntity, [
  "id",
  "sku",
  "name",
  "description",
  "price",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty()
  product_attributes: ProductAttributeDto[];
  
  @ApiPropertyOptional()
  product_order?: ProductOrderDto[];
  
  @ApiProperty()
  afile: FileDto[];
  
  @ApiProperty()
  location: LocationDto;
  
  @ApiProperty()
  product_status: ProductStatusDto;

  @ApiProperty()
  product_type: ProductTypeDto;
}
