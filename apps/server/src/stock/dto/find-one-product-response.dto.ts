import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { FileEntity } from "../../file/entities/file.entity";
import { LocationEntity } from "../../location/entities/location.entity";
import { ProductOrderEntity } from "../entities/product-order.entity";
import { ProductStatusEntity } from "../entities/product-status.entity";
import { ProductTypeEntity } from "../entities/product-type.entity";
import { ProductEntity } from "../entities/product.entity";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { AOrderEntity } from "../../aorder/entities/aorder.entity";

class ProductAttributeDto extends PickType(ProductAttributeEntity, [
  'quantity',
  'attribute_id',
  'value'
]) {}

class AOrderDto extends PickType(AOrderEntity, [
  'id',
  'order_nr',
  'order_date',
  'discr'
]) {
  @ApiProperty()
  company: string;

  @ApiProperty()
  status: string;
}

export class ProductOrderDto extends PickType(ProductOrderEntity, [
  'quantity',
]) {
  @ApiPropertyOptional()
  order?: AOrderDto;
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
  product_orders?: ProductOrderDto[];
  
  @ApiProperty()
  afile: FileDto[];
  
  @ApiProperty()
  location: LocationDto;
  
  @ApiProperty()
  product_status: ProductStatusDto;

  @ApiProperty()
  product_type: ProductTypeDto;
}
