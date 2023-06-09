import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { AOrderController } from '../aorder/aorder.controller';

@ApiTags('sales')
@Controller('sales')
export class SaleController extends AOrderController {
  constructor(protected readonly saleService: SaleService) {
    super(saleService);
  }
}
