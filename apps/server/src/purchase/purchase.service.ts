import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { purchaseRepository } from './purchase.repository';

@Injectable()
export class purchaseService extends OrderService {
  constructor(protected readonly repository: purchaseRepository) {
    super(repository, OrderDiscrimination.PURCHASE);
  }
}
