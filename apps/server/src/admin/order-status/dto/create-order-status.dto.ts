import { OmitType } from '@nestjs/swagger';
import { PrismaOrderStatusCreateInputDto } from './prisma-order-status-create-input.dto';

export class CreateOrderStatusDto extends OmitType(PrismaOrderStatusCreateInputDto, [
  'aorder',
] as const) {}
