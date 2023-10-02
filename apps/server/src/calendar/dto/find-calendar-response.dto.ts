import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEntity } from '../../admin/order-status/entities/order-status.entity';
import { FindLogisticResponeDto } from '../../logistic/dto/find-logistic-response.dto';
import { CompanyEntity } from '../../company/entities/company.entity';

class CalendarProduct {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class CalendarOrder {
  @ApiProperty()
  id: number;

  @ApiProperty()
  order_nr: string;

  @ApiProperty()
  order_status: OrderStatusEntity;

  @ApiProperty()
  products: CalendarProduct[];

  @ApiProperty()
  supplier?: CompanyEntity;

  @ApiProperty()
  customer?: CompanyEntity;
}

export class FindCalendarResponeDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  logistic_date: Date;

  @ApiProperty()
  order: CalendarOrder;
  
  @ApiPropertyOptional()
  logistic?: FindLogisticResponeDto | null;
}
