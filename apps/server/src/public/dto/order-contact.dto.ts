import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { formDataNumberTransform } from '../../common/transforms/form-date.transform';
import { NewContactDto } from './new-contact.dto';

export class OrderContactDto extends NewContactDto {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    company_kvk_nr?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    company_rsin_nr?: number;

  @ApiPropertyOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    company_partner_id?: number;
}
