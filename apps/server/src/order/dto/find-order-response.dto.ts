import { ApiProperty, PickType } from "@nestjs/swagger";
import { OrderEntity } from "../entities/order.entity";

class FindOrderResponeDto extends PickType(OrderEntity, [
  "id",
  "order_nr",
  "order_date",
] as const) {}

export class FindOrdersResponeDto {
  @ApiProperty()
  count: number;
  
  @ApiProperty()
  data: FindOrderResponeDto[]
}
