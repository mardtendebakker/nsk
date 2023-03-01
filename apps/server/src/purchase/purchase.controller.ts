import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { OrderController } from '../order/order.controller';

@ApiTags('purchases')
@Controller('purchases')
export class PurchaseController extends OrderController {
  constructor(protected readonly purchaseService: PurchaseService) {
    super(purchaseService);
  }
}
