import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { RepairService } from './repair.service';

@ApiTags('repairs')
@Controller('repairs')
export class RepairController extends StockController {
  constructor(protected readonly repairService: RepairService) {
    super(repairService);
  }
}
