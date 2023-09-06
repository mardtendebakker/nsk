import { ApiProperty } from "@nestjs/swagger";

export class AutocompleteResponseDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  label: string;
}
