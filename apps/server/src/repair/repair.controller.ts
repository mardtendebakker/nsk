import { Controller } from '@nestjs/common';
import { RepairService } from './repair.service';
import { ApiTags } from '@nestjs/swagger';
import { SaleController } from '../sale/sale.controller';

@ApiTags('repairs')
@Controller('repairs')
export class RepairController extends SaleController {
  constructor(protected readonly repairService: RepairService) {
    super(repairService);
  }
}
