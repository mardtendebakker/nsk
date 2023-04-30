import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { ProductTypeEntity } from "../entities/product-status.entity";

class FindProductTypeResponseDto extends PickType(ProductTypeEntity, [
  "id",
  "name",
] as const) {}

export class FindProductStatusesResponeDto implements IFindManyRespone<FindProductTypeResponseDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindProductTypeResponseDto[]
}
