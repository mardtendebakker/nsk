import { Injectable } from '@nestjs/common';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';
import { AOrderService } from '../aorder/aorder.service';
import { PurchaseRepository } from './purchase.repository';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { ContactService } from '../contact/contact.service';
import { AorderLogService } from '../log/aorder-log.service';

@Injectable()
export class PurchaseService extends AOrderService {
  constructor(
    protected readonly repository: PurchaseRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
    protected readonly aorderLogService: AorderLogService,
  ) {
    super(repository, printService, fileService, contactService, aorderLogService, AOrderDiscrimination.PURCHASE);
  }
}
