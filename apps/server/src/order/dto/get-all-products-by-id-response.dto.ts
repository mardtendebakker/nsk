import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../stock/entities/product.entity";
export class GetAllProductsByIdResponseDto extends PickType(ProductEntity, [
  'sku',
  'name',
  'price',
  'description',
  'type_id',
  'location_id',
  'status_id'
]) {}
