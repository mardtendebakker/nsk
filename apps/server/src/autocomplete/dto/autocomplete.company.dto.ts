import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { AutocompleteDto } from "./autocomplete.dto";

export class AutocompleteCompanyDto extends AutocompleteDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  @ValidateIf((_, value) => value !== undefined)
  partnerOnly?: number
}
