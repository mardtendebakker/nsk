import { ApiProperty } from '@nestjs/swagger';

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
