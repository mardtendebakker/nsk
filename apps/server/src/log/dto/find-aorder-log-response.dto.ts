import { ApiProperty } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';

class OrderStatusDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    color: string;
}

export class FindAorderLogResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    username: string;

  @ApiProperty()
    previous_status_id: number;

  @ApiProperty()
    status_id: number;

  @ApiProperty({ type: OrderStatusDto })
    previous_status: OrderStatusDto;

  @ApiProperty({ type: OrderStatusDto })
    status: OrderStatusDto;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}

export class FindAorderLogsResponseDto implements IFindManyRespone<FindAorderLogResponseDto> {
  @ApiProperty({ type: [FindAorderLogResponseDto] })
    data: FindAorderLogResponseDto[];

  @ApiProperty()
    count: number;
}

