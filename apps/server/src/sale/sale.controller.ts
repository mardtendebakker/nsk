import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { OrderController } from '../order/order.controller';

@ApiTags('sales')
@Controller('sales')
export class SaleController extends OrderController {
  constructor(protected readonly saleService: SaleService) {
    super(saleService);
  }
}
