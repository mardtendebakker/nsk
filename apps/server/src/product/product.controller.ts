import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { ProductService } from './product.service';
import { ProductBlancco } from './product.blancco';
import { SecurityService } from '../security/service/security.service';

@ApiTags('products')
@Controller('products')
export class ProductController extends StockController {
  constructor(
    protected readonly productService: ProductService,
    protected readonly productBlancco: ProductBlancco,
    protected readonly securityService: SecurityService,
  ) {
    super(productService, productBlancco, securityService);
  }
}
