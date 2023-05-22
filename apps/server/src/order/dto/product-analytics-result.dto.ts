import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GroupByDateResult {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;
  
  @ApiPropertyOptional()
  day?: number;
  
  @ApiProperty()
  count: number;
}

export class ProductAnalyticsResultDto {
  @ApiProperty()
  nonrepair: GroupByDateResult[];

  @ApiProperty()
  repair: GroupByDateResult[];
}
