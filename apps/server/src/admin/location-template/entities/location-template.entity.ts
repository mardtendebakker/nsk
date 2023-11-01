import { location_template } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LocationTemplateEntity implements location_template {
  @ApiProperty()
  id: number;

  @ApiProperty()
  location_id: number;

  @ApiProperty({ example: '^\\d-\\d-\\d$' })
  template: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
