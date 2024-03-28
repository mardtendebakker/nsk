import { location_label } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LocationLabelEntity implements location_label {
  @ApiProperty()
    id: number;

  @ApiProperty()
    location_id: number;

  @ApiProperty()
    label: string;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}
