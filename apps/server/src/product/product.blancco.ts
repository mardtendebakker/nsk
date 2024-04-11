import { Injectable } from '@nestjs/common';
import { BlanccoService } from '../blancco/blancco.service';
import { StockBlancco } from '../stock/stock.blancco';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Injectable()
export class ProductBlancco extends StockBlancco {
  constructor(
    protected readonly repository: ProductRepository,
    protected readonly productService: ProductService,
    protected readonly blanccoService: BlanccoService,
  ) {
    super(repository, productService, blanccoService);
  }
}
