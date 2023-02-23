import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { SaleRepository } from './sale.repository';

@Injectable()
export class SaleService extends OrderService {
  constructor(protected readonly repository: SaleRepository) {
    super(repository, OrderDiscrimination.SALE);
  }
}
