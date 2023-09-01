import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateProductTypeDto } from "./create-product-type.dto";
import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, {each: true})
  @Transform(({value}) => Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value))
  attributes: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, {each: true})
  @Transform(({value}) => Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value))
  tasks: number[];
}
