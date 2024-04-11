import { ApiProperty } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';
import { TaskEntity } from '../entities/task.entity';

class productType {
  @ApiProperty()
    id: number;
}

export class FindTaskResponseDto extends TaskEntity {
  @ApiProperty()
    productTypes: productType[];
}

export class FindTasksResponeDto implements IFindManyRespone<FindTaskResponseDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindTaskResponseDto[];
}
