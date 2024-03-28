import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEntity } from '../../admin/order-status/entities/order-status.entity';
import { FindLogisticResponeDto } from '../../logistic/dto/find-logistic-response.dto';
import { ContactEntity } from '../../contact/entities/contact.entity';

class CalendarOrder {
  @ApiProperty()
    id: number;

  @ApiProperty()
    order_nr: string;

  @ApiProperty()
    order_status: OrderStatusEntity;

  @ApiProperty()
    supplier?: ContactEntity;

  @ApiProperty()
    customer?: ContactEntity;
}

export class FindCalendarResponeDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    event_date: Date;

  @ApiProperty()
    event_title: string;

  @ApiProperty()
    order: CalendarOrder;

  @ApiPropertyOptional()
    logistic?: FindLogisticResponeDto | null;
}
