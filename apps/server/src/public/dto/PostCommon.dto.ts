import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { formDataStringTransform } from '../../common/transforms/form-date.transform';

export class PostCommonDto {
  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    'g-recaptcha-response'?: string;
}
