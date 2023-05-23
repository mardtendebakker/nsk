import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { AOrderController } from '../aorder/aorder.controller';

@ApiTags('purchases')
@Controller('purchases')
export class PurchaseController extends AOrderController {
  constructor(protected readonly purchaseService: PurchaseService) {
    super(purchaseService);
  }
}
