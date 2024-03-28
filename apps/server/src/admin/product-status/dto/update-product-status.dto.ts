import { PartialType } from '@nestjs/swagger';
import { CreateProductStatusDto } from './create-product-status.dto';

export class UpdateProductStatusDto extends PartialType(CreateProductStatusDto) {}
