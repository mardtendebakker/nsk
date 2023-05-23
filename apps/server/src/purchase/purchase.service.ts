import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { PurchaseRepository } from './purchase.repository';
import { PrintService } from '../print/print.service';

@Injectable()
export class PurchaseService extends AOrderService {
  constructor(
    protected readonly repository: PurchaseRepository,
    protected readonly printService: PrintService
  ) {
    super(repository, printService, AOrderDiscrimination.PURCHASE);
  }
}
