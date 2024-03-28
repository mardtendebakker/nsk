import { ApiProperty } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';
import { ProcessedStock } from './processed-stock.dto';

export class FindProductsResponseDto implements IFindManyRespone<ProcessedStock> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: ProcessedStock[];
}
