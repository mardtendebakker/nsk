import { OmitType } from "@nestjs/swagger";
import { PrismaOrderCreateInputDto } from "./prisma-order-create-input.dto";

export class CreateOrderDto extends OmitType(PrismaOrderCreateInputDto, ['discr'] as const) {}
