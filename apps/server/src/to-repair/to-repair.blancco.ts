import { Injectable } from '@nestjs/common';
import { BlanccoService } from '../blancco/blancco.service';
import { StockBlancco } from '../stock/stock.blancco';
import { ToRepairRepository } from './to-repair.repository';
import { ToRepairService } from './to-repair.service';

@Injectable()
export class ToRepairBlancco extends StockBlancco {
  constructor(
    protected readonly repository: ToRepairRepository,
    protected readonly toRepairService: ToRepairService,
    protected readonly blanccoService: BlanccoService,
  ) {
    super(repository, toRepairService, blanccoService);
  }
}
