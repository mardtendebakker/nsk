import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { GroupBy } from './types/group-by.enum';
import { AnalyticsResultDto } from './dto/analytics-result.dto';

@Injectable()
export class OrderService {
  constructor(protected readonly repository: OrderRepository) {}

  async analytics(groupBy: GroupBy): Promise<AnalyticsResultDto> {
    return this.repository.analytics(groupBy);
  }
}
