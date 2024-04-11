import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindManyDto as BaseFindManyDto } from '../../common/dto/find-many.dto';

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    moduleName?: string;
}
