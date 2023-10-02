import { ApiProperty, PickType } from "@nestjs/swagger";
import { IFindManyRespone } from "../../../common/interface/find-many-respone";
import { OrderStatusEntity } from "../entities/order-status.entity";

class FindOrderStatusResponeDto extends PickType(OrderStatusEntity, [
  "id",
  "is_purchase",
  "is_sale",
  "is_repair",
  "color",
  "name",
] as const) {}

export class FindOrderStatusesResponeDto implements IFindManyRespone<FindOrderStatusResponeDto> {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindOrderStatusResponeDto[]
}
