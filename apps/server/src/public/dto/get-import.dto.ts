import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GetCommonDto } from './get-common.dto';

export class GetImportDto extends PickType(GetCommonDto, ['orderStatusName']) {
  @ApiPropertyOptional()
  @IsString()
    partnerId?: string;
}
