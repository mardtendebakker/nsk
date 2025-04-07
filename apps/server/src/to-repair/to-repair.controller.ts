import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { ToRepairService } from './to-repair.service';
import { ToRepairBlancco } from './to-repair.blancco';
import { SecurityService } from '../security/service/security.service';

@ApiTags('to-repairs')
@Controller('to-repairs')
export class ToRepairController extends StockController {
  constructor(
    protected readonly repairService: ToRepairService,
    protected readonly toRepairBlancco: ToRepairBlancco,
    protected readonly securityService: SecurityService,
  ) {
    super(repairService, toRepairBlancco, securityService);
  }
}
