import { OmitType } from "@nestjs/swagger";
import { PrismaProductStatusCreateInputDto } from "./prisma-product-status-create-input.dto";

export class CreateProductStatusDto extends OmitType(PrismaProductStatusCreateInputDto, [
  'product'
] as const) {}
