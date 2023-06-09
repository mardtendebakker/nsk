import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { AOrderEntity } from "../entities/aorder.entity";

class FindAOrderResponeDto extends PickType(AOrderEntity, [
  "id",
  "order_nr",
  "order_date",
] as const) {}

export class FindAOrdersResponeDto implements IFindManyRespone<FindAOrderResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindAOrderResponeDto[]
}
