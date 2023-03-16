import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class PaginationDto {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;
  
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}
