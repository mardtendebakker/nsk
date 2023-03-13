import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { ProductEntity } from "../entities/product.entity";

export class FindProductResponeDto extends PickType(ProductEntity, [
  "id",
  "sku",
  "name",
  "price",
  "created_at",
  "updated_at"
] as const) {
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
  done: number;
  
  @ApiProperty()
  tasks: number;

  @ApiProperty()
  splittable: boolean;
}

export class FindProductsResponseDto implements IFindManyRespone<FindProductResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindProductResponeDto[]
}
