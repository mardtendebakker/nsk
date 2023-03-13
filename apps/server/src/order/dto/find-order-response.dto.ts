import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../common/interface/find-many-respone";
import { OrderEntity } from "../entities/order.entity";

class FindOrderResponeDto extends PickType(OrderEntity, [
  "id",
  "order_nr",
  "order_date",
] as const) {}

export class FindOrdersResponeDto implements IFindManyRespone<FindOrderResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindOrderResponeDto[]
}
