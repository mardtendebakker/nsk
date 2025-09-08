import { OmitType } from '@nestjs/swagger';
import { PrismaProductSubTypeCreateInputDto } from './prisma-product-sub-type-create-input.dto';

export class CreateProductSubTypeDto extends OmitType(PrismaProductSubTypeCreateInputDto, [
  'id',
] as const) {}
