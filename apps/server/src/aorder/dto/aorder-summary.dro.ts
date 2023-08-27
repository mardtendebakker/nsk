import { ApiProperty, PickType } from "@nestjs/swagger";
import { AOrderEntity } from "../entities/aorder.entity";

export class AOrderSummaryDto extends PickType(AOrderEntity, ['id', 'order_nr', 'order_date', 'discr'] as const) {
  @ApiProperty()
  status: string;
}
