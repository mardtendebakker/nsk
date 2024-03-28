import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
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
