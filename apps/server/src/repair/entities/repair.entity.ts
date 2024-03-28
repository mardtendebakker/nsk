import { ApiProperty } from '@nestjs/swagger';
import { repair } from '@prisma/client';

export class RepairEntity implements repair {
  @ApiProperty()
    id: number;

  @ApiProperty()
    order_id: number | null;

  @ApiProperty()
    description: string | null;

  @ApiProperty()
    damage: string | null;
}
