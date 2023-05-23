import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { GroupBy } from "../types/group-by.enum";

export class ProductAnalyticsDto {
  @ApiPropertyOptional({
    enum: GroupBy,
    example: GroupBy.DAYS,
  })
  @IsEnum(GroupBy)
  @Type(() => String)
  @ValidateIf((_, value) => value !== undefined)
  groupby?: GroupBy;
}
