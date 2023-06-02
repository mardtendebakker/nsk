import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { formDataNumberTransform, formDataStringTransform } from "../../common/transforms/form-date.transform";

export class ProductAttributeFormDto extends ProductAttributeEntity {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsNumber()
  @Type(() => Number)
  attribute_id: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value_product_id: number | null;

  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  value: string;

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
  external_id: number | null;
}
