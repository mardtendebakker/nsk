import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class FindOneDto {
  @ApiProperty()
  @Transform(({value}) => JSON.parse(value))
  where: any;

  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  select?: any;

  @ApiPropertyOptional()
  @Transform(({value}) => JSON.parse(value))
  include?: any;
}
