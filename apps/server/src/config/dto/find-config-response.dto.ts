import { ApiProperty } from '@nestjs/swagger';

class Logistics {
  @ApiProperty()
    apiKey: string;

  @ApiProperty()
    maxHour: number;

  @ApiProperty()
    minHour: number;

  @ApiProperty()
    days: string[];
}

export class FindConfigResponseDto {
  @ApiProperty()
    logistics: Logistics;
}
