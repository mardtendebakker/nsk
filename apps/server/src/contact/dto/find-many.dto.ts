import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean, IsInt, IsOptional, IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FindManyDto as BaseFindManyDto } from '../../common/dto/find-many.dto';

const booleanTransformer = ({ value }) => {
  if (value !== undefined) {
    return value === 'true';
  }

  return value;
};

export class FindManyDto extends BaseFindManyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
    search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
    company_id?: number;

  @ApiPropertyOptional()
  @Transform(booleanTransformer)
  @IsOptional()
  @IsBoolean()
    is_customer?: boolean;

  @ApiPropertyOptional()
  @Transform(booleanTransformer)
  @IsOptional()
  @IsBoolean()
    is_supplier?: boolean;

  @ApiPropertyOptional()
  @Transform(booleanTransformer)
  @IsOptional()
  @IsBoolean()
    is_partner?: boolean;
}
