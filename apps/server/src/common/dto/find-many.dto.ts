import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { FindOneDto } from './find-one.dto';
import { PaginationDto } from './pagination.dto';

export class FindManyDto extends IntersectionType(PaginationDto, FindOneDto) {
  @ApiPropertyOptional()
  @Transform(({ value }) => JSON.parse(value))
    orderBy?: any;

  @ApiPropertyOptional()
  @Transform(({ value }) => JSON.parse(value))
    cursor?: any;

  @ApiPropertyOptional()
  @Transform(({ value }) => JSON.parse(value))
    distinct?: any;
}
