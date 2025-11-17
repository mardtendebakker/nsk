import { ApiProperty } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';

export class FindProductLogResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    product_id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    sku: string;

  @ApiProperty()
    order_nr: string;

  @ApiProperty({ enum: ['delete', 'add', 'update'] })
    action: string;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}

export class FindProductLogsResponseDto implements IFindManyRespone<FindProductLogResponseDto> {
  @ApiProperty({ type: [FindProductLogResponseDto] })
    data: FindProductLogResponseDto[];

  @ApiProperty()
    count: number;
}
