import { ApiProperty } from '@nestjs/swagger';
import { pickup } from '@prisma/client';

export class PickupEntity implements pickup {
  @ApiProperty()
    id: number;

  @ApiProperty()
    order_id: number | null;

  @ApiProperty()
    logistics_id: number | null;

  @ApiProperty()
    pickup_date: Date | null;

  @ApiProperty()
    real_pickup_date: Date | null;

  @ApiProperty()
    origin: string | null;

  @ApiProperty()
    data_destruction: number | null;

  @ApiProperty()
    description: string | null;
}
