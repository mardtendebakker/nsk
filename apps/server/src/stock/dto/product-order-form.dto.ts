import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { Transform, Type } from "class-transformer";
import { formDataNumberTransform } from "../../common/transforms/form-date.transform";
import { ProductOrderEntity } from "../entities/product-order.entity";

export class ProductOrderFormDto extends ProductOrderEntity {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  product_id: number | null;
  
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  order_id: number;
  
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity: number | null;
  
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number | null;
  
  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  external_id: number | null;
}
