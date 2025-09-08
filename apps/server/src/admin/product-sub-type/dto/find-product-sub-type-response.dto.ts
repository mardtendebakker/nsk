import { ApiProperty, PickType } from '@nestjs/swagger';
import { IFindManyRespone } from '../../../common/interface/find-many-respone';
import { ProductSubTypeEntity } from '../entities/product-sub-type.entity';

export class FindProductSubTypeResponseDto extends PickType(ProductSubTypeEntity, [
  'id',
  'name',
] as const) {}

export class FindProductSubTypesResponeDto implements IFindManyRespone<FindProductSubTypeResponseDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindProductSubTypeResponseDto[];
}
