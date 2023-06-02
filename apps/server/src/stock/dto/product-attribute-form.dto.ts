import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { formDataToNullTransform, formDataToStringTransform } from "../../common/transforms/form-date.transform";

export class ProductAttributeFormDto extends ProductAttributeEntity {
  @ApiProperty()
  @Transform(formDataToNullTransform)
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @ApiProperty()
  @Transform(formDataToNullTransform)
  @IsNumber()
  @Type(() => Number)
  attribute_id: number;

  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value_product_id: number | null;

  @ApiProperty()
  @Transform(formDataToStringTransform)
  @IsString()
  @Type(() => String)
  value: string;

  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity: number | null;

  @ApiPropertyOptional()
  @Transform(formDataToNullTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  external_id: number | null;
}
