import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { formDataNumberTransform } from '../../common/transforms/form-data.transform';

export class ImportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    partner_id?: number | null;
}
