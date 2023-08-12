import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { PurchaseRepository } from './purchase.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';

@Injectable()
export class PurchaseService extends AOrderService {
  constructor(
    protected readonly repository: PurchaseRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
  ) {
    super(repository, printService, fileService, AOrderDiscrimination.PURCHASE);
  }
}
