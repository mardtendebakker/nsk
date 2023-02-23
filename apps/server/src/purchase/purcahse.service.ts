import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { PurcahseRepository } from './purcahse.repository';

@Injectable()
export class PurcahseService extends OrderService {
  constructor(protected readonly repository: PurcahseRepository) {
    super(repository, OrderDiscrimination.PURCHASE);
  }
}
