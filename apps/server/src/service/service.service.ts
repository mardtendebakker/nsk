import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { ServiceRepository } from './service.repository';
import { PrintService } from '../print/print.service';

@Injectable()
export class ServiceService extends AOrderService {
  constructor(
    protected readonly repository: ServiceRepository,
    protected readonly printService: PrintService
  ) {
    super(repository, printService, AOrderDiscrimination.SALE);
  }
}
