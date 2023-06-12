import { OmitType, PartialType } from "@nestjs/swagger";
import { ProductAttributeFormDto } from "./product-attribute-form.dto";
import { CreateBodyStockDto } from "./create-body-stock.dto";

export class ProductAttributeUpdateDto extends OmitType(ProductAttributeFormDto, ['product_id']) {}

export class UpdateBodyStockDto extends PartialType(CreateBodyStockDto) {}
