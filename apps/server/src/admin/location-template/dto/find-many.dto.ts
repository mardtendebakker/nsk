import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../../common/dto/find-many.dto";
import { IsInt, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
  location?: number;

  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  search?: string
}
