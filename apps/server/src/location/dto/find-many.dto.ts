import { ApiPropertyOptional } from "@nestjs/swagger";
import { FindManyDto as BaseFindManyDto } from "../../common/dto/find-many.dto";
import { IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
  search?: string
  
  @Transform(({value}) => Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value))
  @ApiPropertyOptional()
  ids?: number[];
}
