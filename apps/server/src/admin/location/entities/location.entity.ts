import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { location } from "@prisma/client";

export class LocationEntity implements location {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  zipcodes: string | null;
}
