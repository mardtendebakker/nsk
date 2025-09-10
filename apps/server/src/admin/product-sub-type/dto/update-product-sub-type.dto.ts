import { PartialType } from '@nestjs/swagger';
import { CreateProductSubTypeDto } from './create-product-sub-type.dto';

export class UpdateProductSubTypeDto extends PartialType(CreateProductSubTypeDto) {}
