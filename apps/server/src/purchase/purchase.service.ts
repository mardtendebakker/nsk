import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { PurchaseRepository } from './purchase.repository';

@Injectable()
export class PurchaseService extends OrderService {
  constructor(protected readonly repository: PurchaseRepository) {
    super(repository, OrderDiscrimination.PURCHASE);
  }
}
