import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { formDataNumberTransform } from '../../common/transforms/form-data.transform';
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Single Excel file',
  })
  @IsOptional()
  @Type(() => Object)
    file: Express.Multer.File;
}
