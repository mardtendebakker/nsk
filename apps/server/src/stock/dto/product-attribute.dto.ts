import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { ProductAttributeEntity } from "../entities/product-attribute.entity";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { formDataNumberTransform, formDataStringTransform } from "../../common/transforms/form-date.transform";

export class ProductAttributeDto extends PartialType(OmitType(ProductAttributeEntity, ['product_id'])) {
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
  value_product_id?: number | null;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
  value?: string;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number | null;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  external_id?: number | null;
}
