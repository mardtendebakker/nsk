import { ApiProperty, PickType } from "@nestjs/swagger";
import { FileEntity } from "../../file/entities/file.entity";
import { LocationEntity } from "../../location/entities/location.entity";
import { ProductOrderEntity } from "../entities/product-order.entity";
import { ProductStatusEntity } from "../entities/product-status.entity";
import { ProductTypeEntity } from "../entities/product-type.entity";
import { ProductEntity } from "../entities/product.entity";
import { AttributeEntity } from "../../attribute/entities/attribute.entity";

export class FindOneProductResponeDto extends PickType(ProductEntity, [
  "id",
  "sku",
  "name",
  "price",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty()
  attributes: AttributeEntity[];

  @ApiProperty()
  listPrice: number;
  
  @ApiProperty()
  product_order: ProductOrderEntity[];
  
  @ApiProperty()
  afile: FileEntity[];
  
  @ApiProperty()
  locations: LocationEntity[];
  
  @ApiProperty()
  product_statuses: ProductStatusEntity[];

  @ApiProperty()
  product_types: ProductTypeEntity[];
}
