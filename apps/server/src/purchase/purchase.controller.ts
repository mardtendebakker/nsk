import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { purchaseService } from './purchase.service';
import { OrderController } from '../order/order.controller';

@ApiTags('purchases')
@Controller('purchases')
export class purchaseController extends OrderController {
  constructor(protected readonly purchaseService: purchaseService) {
    super(purchaseService);
  }
}
