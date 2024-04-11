import { ApiProperty, PickType } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';
import { FosUserEntity } from '../entities/fos-user.entity';

export class FindLogisticResponeDto extends PickType(FosUserEntity, [
  'id',
  'username',
] as const) {}

export class FindLogisticsResponeDto implements IFindManyRespone<FindLogisticResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindLogisticResponeDto[];
}
