import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateIf } from 'class-validator';
import { PrismaAttributeCreateInputDto } from './prisma-attribute-create-input.dto';

class AttributeOption {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    id: number;

  @ApiProperty()
  @IsString()
  @Type(() => String)
    name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    price?: number;
}

export class CreateAttributeDto extends OmitType(PrismaAttributeCreateInputDto, [
  'product_type',
  'attribute_option',
  'product_attribute',
  'product_type_attribute',
] as const) {
  @ApiProperty()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value)))
    productTypes: number[];

  @ApiPropertyOptional()
  @Type(() => AttributeOption)
  @ValidateIf((_, value) => value !== undefined && value.length != 0)
    options?: AttributeOption[];
}
