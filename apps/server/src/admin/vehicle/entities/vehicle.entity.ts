import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { vehicle } from '@prisma/client';

export class VehicleEntity implements vehicle {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    registration_number: string;

  @ApiPropertyOptional()
    type: 'car' | null;
}
