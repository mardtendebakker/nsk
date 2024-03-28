import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { FindManyDto as BaseFindManyDto } from '../../common/dto/find-many.dto';

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    search?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    status?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    partner?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    createdBy?: number;
}
