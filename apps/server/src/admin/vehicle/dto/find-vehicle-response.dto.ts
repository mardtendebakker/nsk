import { ApiProperty, PickType } from '@nestjs/swagger';
import { IFindManyRespone } from '../../../common/interface/find-many-respone';
import { VehicleEntity } from '../entities/vehicle.entity';

export class FindVehicleResponeDto extends PickType(VehicleEntity, [
  'id',
  'name',
  'registration_number',
] as const) {}

export class FindVehiclesResponeDto implements IFindManyRespone<FindVehicleResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindVehicleResponeDto[];
}
