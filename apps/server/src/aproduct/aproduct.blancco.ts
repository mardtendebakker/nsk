import { Injectable } from '@nestjs/common';
import { BlanccoService } from '../blancco/blancco.service';
import { StockBlancco } from '../stock/stock.blancco';
import { AProductRepository } from './aproduct.repository';
import { AProductService } from './aproduct.service';

@Injectable()
export class AProductBlancco extends StockBlancco {
  constructor(
    protected readonly repository: AProductRepository,
    protected readonly aProductService: AProductService,
    protected readonly blanccoService: BlanccoService,
  ) {
    super(repository, aProductService, blanccoService);
  }
}
