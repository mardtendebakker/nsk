import { ApiProperty, PickType } from "@nestjs/swagger";
import { OrderEntity } from "../entities/order.entity";

export class FindOrderResponeDto extends PickType(OrderEntity, [
  "order_nr",
  "id",
  "order_date",
] as const) {
  @ApiProperty()
  company_name: string;
}
