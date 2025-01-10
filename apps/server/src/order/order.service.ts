import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { GroupBy } from './types/group-by.enum';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { PrintService } from '../print/print.service';
import { FileService } from '../file/file.service';
import { AOrderService } from '../aorder/aorder.service';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class OrderService extends AOrderService {
  constructor(
    protected readonly repository: OrderRepository,
    protected readonly printService: PrintService,
    protected readonly fileService: FileService,
    protected readonly contactService: ContactService,
  ) {
    super(repository, printService, fileService, contactService);
  }

  async analytics(groupBy: GroupBy, email?: string): Promise<AnalyticsResultDto> {
    return this.repository.analytics(groupBy, email);
  }
}
