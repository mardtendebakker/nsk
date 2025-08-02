import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IFindManyRespone } from '../../common/interface/find-many-respone';

export class FindEmailLogResponeDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    from: string;

  @ApiProperty()
    to: string;

  @ApiProperty()
    subject: string;

  @ApiProperty()
    successful: boolean;

  @ApiProperty()
    content: string;

  @ApiPropertyOptional()
    api_error?: string;
}

export class FindDriversResponeDto implements IFindManyRespone<FindEmailLogResponeDto> {
  @ApiProperty()
    count: number;

  @ApiProperty()
    data: FindEmailLogResponeDto[];
}
