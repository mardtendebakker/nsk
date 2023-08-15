import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { ToRepairService } from './to-repair.service';

@ApiTags('to-repairs')
@Controller('to-repairs')
export class ToRepairController extends StockController {
  constructor(protected readonly repairService: ToRepairService) {
    super(repairService);
  }
}
