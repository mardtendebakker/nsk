import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class ListUserDto {
  @ApiPropertyOptional()
  filter?: string;

  @ApiPropertyOptional()
  attributes?: string[];
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
  
  @ApiPropertyOptional()
  pagetoken?: string;
}
