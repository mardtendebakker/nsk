import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AutocompleteDto {
  @ApiPropertyOptional()
  @IsString()
  @ValidateIf((_, value) => value !== undefined)
    search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((id: string) => parseInt(id)) : parseInt(value)))
    ids?: number[];
}

export class LocationLabelsAutocompleteDto extends AutocompleteDto {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    location_id?: number;
}

export class ProductSubTypesAutocompleteDto extends AutocompleteDto {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @ValidateIf((_, value) => value !== undefined)
    product_type_id?: number;
}
