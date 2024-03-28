import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { formDataStringTransform } from '../../common/transforms/form-date.transform';

export class CommonFormDto {
  @ApiProperty()
  @Transform(formDataStringTransform)
  @IsString()
  @Type(() => String)
    orderStatusName: string;

  @ApiPropertyOptional()
  @Transform(formDataStringTransform)
  @IsOptional()
  @IsString()
  @Type(() => String)
    confirmPage?: string;
}
