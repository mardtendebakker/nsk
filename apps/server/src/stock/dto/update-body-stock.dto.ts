import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { CreateBodyStockDto } from "./create-body-stock.dto";
import { ProductOrderUpdateDto } from "./product-order-update.dto";
import { Transform, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { formDataNumberTransform } from "../../common/transforms/form-date.transform";

export class UpdateBodyStockDto extends PartialType(OmitType(CreateBodyStockDto, ['product_orders', 'type_id'])) {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  type_id: number;

  @ApiPropertyOptional()
  @Type(() => ProductOrderUpdateDto)
  product_orders?: ProductOrderUpdateDto[];
}
