import { Injectable } from '@nestjs/common';
import { OrderDiscrimination } from '../order/types/order-discrimination.enum';
import { OrderService } from '../order/order.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';

@Injectable()
export class SaleService extends OrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService
  ) {
    super(repository, printService, OrderDiscrimination.SALE);
  }
}
