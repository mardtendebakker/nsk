import { ApiProperty } from '@nestjs/swagger';
import { IFindManyRespone } from '../../../common/interface/find-many-respone';

export class FindDriverResponeDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    first_name: string | null;

  @ApiProperty()
    last_name: string | null;

  @ApiProperty()
    username: string;

  @ApiProperty()
    email: string;
}

export class FindDriversResponeDto implements IFindManyRespone<FindDriverResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindDriverResponeDto[];
}
