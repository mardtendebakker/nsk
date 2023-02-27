import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { PaginationDto } from "./pagination.dto";

export class FindManyDto extends PaginationDto {
  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  select?: any;

  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  include?: any;
  
  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  where?: any;
  
  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  orderBy?: any;
  
  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  cursor?: any;
  
  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  distinct?: any;
}
