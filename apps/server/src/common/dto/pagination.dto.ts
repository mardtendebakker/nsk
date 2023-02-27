import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class PaginationDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  take?: number;
  
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}
