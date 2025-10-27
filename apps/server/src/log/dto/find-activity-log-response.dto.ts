import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';

export class FindActivityLogResponseDto {
  @ApiProperty()
    id: number;

  @ApiPropertyOptional()
    username?: string;

  @ApiPropertyOptional()
    method?: string;

  @ApiPropertyOptional()
    route?: string;

  @ApiPropertyOptional()
    params?: string;

  @ApiPropertyOptional()
    body?: string;

  @ApiPropertyOptional()
    query?: string;

  @ApiPropertyOptional()
    before?: string;

  @ApiPropertyOptional()
    model?: string;

  @ApiPropertyOptional()
    action?: string;

  @ApiProperty()
    bulk: boolean;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updated_at: Date;
}

export class FindActivityLogsResponseDto implements IFindManyRespone<FindActivityLogResponseDto> {
  @ApiProperty({ type: [FindActivityLogResponseDto] })
    data: FindActivityLogResponseDto[];

  @ApiProperty()
    count: number;
}
