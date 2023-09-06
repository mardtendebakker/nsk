import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class AutocompleteDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  search?: string;

  @ApiPropertyOptional()
  @Transform(({value}) => Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value))
  ids?: number[];
}
