import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductAttributeEntity {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  attribute_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value_product_id?: number | null;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  external_id?: number | null;
}
