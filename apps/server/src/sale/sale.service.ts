import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { SaleRepository } from './sale.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';

@Injectable()
export class SaleService extends AOrderService {
  constructor(
    protected readonly repository: SaleRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
  ) {
    super(repository, printService, fileService, AOrderDiscrimination.SALE);
  }
}
