import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { FindManyDto as BaseFindManyDto } from '../../common/dto/find-many.dto';

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
    startsAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
    endsAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    licensePlate?: string;
}
