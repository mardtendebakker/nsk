import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { ProductTypeEntity } from "../entities/product-type.entity";

class FindProductTypeResponseDto extends PickType(ProductTypeEntity, [
  "id",
  "name",
] as const) {}

export class FindProductTypesResponeDto implements IFindManyRespone<FindProductTypeResponseDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindProductTypeResponseDto[]
}
