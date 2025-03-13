import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { formDataNumberTransform, formDataStringTransform } from '../../common/transforms/form-date.transform';
import { NewContactDto } from './new-contact.dto';

export class OrderContactDto extends NewContactDto {
  @ApiProperty()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    company_kvk_nr?: number;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    reason?: string;
}
