import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupByDateResult {
  @ApiProperty()
    year: number;

  @ApiProperty()
    month: number;

  @ApiPropertyOptional()
    day?: number;

  @ApiProperty()
    color: string;

  @ApiProperty()
    count: number;
}

export class AnalyticsResultDto {
  @ApiProperty()
    sale: GroupByDateResult[];

  @ApiProperty()
    purchase: GroupByDateResult[];

  @ApiProperty()
    repair: GroupByDateResult[];
}
