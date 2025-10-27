import { ApiProperty } from '@nestjs/swagger';

class OrderStatus {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    color: string;
}

export class AorderLogEntity {
  @ApiProperty()
    id: number;

  @ApiProperty()
    username: string;

  @ApiProperty()
    previous_status_id: number;

  @ApiProperty()
    status_id: number;

  @ApiProperty({ type: OrderStatus })
    previous_status: OrderStatus;

  @ApiProperty({ type: OrderStatus })
    status: OrderStatus;

  @ApiProperty()
    created_at: Date;

  @ApiProperty()
    updated_at: Date;
}

