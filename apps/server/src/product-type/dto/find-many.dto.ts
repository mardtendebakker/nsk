import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { IsIn, IsInt, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  nameContains?: string

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  @ValidateIf((_, value) => value !== undefined)
  attributeOnly?: number
}
