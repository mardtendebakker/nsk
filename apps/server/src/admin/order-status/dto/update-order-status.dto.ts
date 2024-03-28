import { PartialType } from '@nestjs/swagger';
import { CreateOrderStatusDto } from './create-order-status.dto';

export class UpdateOrderStatusDto extends PartialType(CreateOrderStatusDto) {}
