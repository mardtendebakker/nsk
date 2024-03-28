import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { formDataNumberTransform } from '../../common/transforms/form-date.transform';
import { PostCommonDto } from './PostCommon.dto';

export class ImportFormDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(formDataNumberTransform)
  @IsInt()
  @Type(() => Number)
    partnerId?: number;
}

export class PostImportDto extends PostCommonDto {
  @ApiProperty()
  @Type(() => ImportFormDto)
    'import_form': ImportFormDto;
}
