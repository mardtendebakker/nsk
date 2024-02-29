import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { ProductService } from './product.service';
import { ProductBlancco } from './product.blancco';

@ApiTags('products')
@Controller('products')
export class ProductController extends StockController {
  constructor(
    protected readonly productService: ProductService,
    protected readonly productBlancco: ProductBlancco,
  ) {
    super(productService, productBlancco);
  }
}
