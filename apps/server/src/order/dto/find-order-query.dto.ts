import { PickType } from "@nestjs/swagger";
import { OrderEntity } from "../entities/order.entity";

export class  FindOrderQueryDto extends PickType(OrderEntity, ['order_nr'] as const) {}