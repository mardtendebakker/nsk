import { ApiProperty, PickType } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';
import { ContactEntity } from '../entities/contact.entity';

class FindContactResponeDto extends PickType(ContactEntity, [
  'id',
  'name',
  'email',
] as const) {
  @ApiProperty()
    compnay_name: string;
}

export class FindContactsResponeDto implements IFindManyRespone<FindContactResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindContactResponeDto[];
}
