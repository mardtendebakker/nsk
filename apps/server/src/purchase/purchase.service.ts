import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { PurchaseRepository } from './purchase.repository';
import { PrintService } from '../print/print.service';

@Injectable()
export class PurchaseService extends OrderService {
  constructor(
    protected readonly repository: PurchaseRepository,
    protected readonly printService: PrintService
  ) {
    super(repository, printService, OrderDiscrimination.PURCHASE);
  }
}
