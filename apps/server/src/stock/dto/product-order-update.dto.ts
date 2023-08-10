import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ProductOrderCreateDto } from "./product-order-create.dto";
import { Transform, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { formDataNumberTransform } from "../../common/transforms/form-date.transform";

export class ProductOrderUpdateDto extends OmitType(ProductOrderCreateDto, ['order_id']) {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  id: number;
}
