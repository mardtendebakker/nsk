import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AutocompleteResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    label: string;
}

export class LocationAutocompleteResponseDto extends AutocompleteResponseDto {
  @ApiProperty()
    location_template: string[];
}
export class OrderStatusAutocompleteResponseDto extends AutocompleteResponseDto {
  @ApiPropertyOptional()
    translations?: [key: string, value: string][];
}
export class ProductStatusAutocompleteResponseDto extends AutocompleteResponseDto {
  @ApiPropertyOptional()
    translations?: [key: string, value: string][];
}
