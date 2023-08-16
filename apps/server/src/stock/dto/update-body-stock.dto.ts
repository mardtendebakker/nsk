import { ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { CreateBodyStockDto } from "./create-body-stock.dto";
import { ProductOrderUpdateDto } from "./product-order-update.dto";
import { Type } from "class-transformer";

export class UpdateBodyStockDto extends PartialType(OmitType(CreateBodyStockDto, ['product_orders'])) {
  @ApiPropertyOptional()
  @Type(() => ProductOrderUpdateDto)
  product_orders?: ProductOrderUpdateDto[];
}
