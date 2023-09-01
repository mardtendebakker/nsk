import { OmitType } from "@nestjs/swagger";
import { PrismaProductTypeCreateInputDto } from "./prisma-product-type-create-input.dto";

export class CreateProductTypeDto extends OmitType(PrismaProductTypeCreateInputDto, [
    'attribute',
    'product',
    'product_type_attribute',
    'product_type_task',
  ] as const) {}
