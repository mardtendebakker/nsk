import { Controller } from '@nestjs/common';
import { StockController } from '../stock/stock.controller';
import { AProductService } from './aproduct.service';
import { ApiTags } from '@nestjs/swagger';
import { AProductBlancco } from './aproduct.blancco';

@ApiTags('aproduct')
@Controller('aproduct')
export class AproductController extends StockController {
  constructor(
    protected readonly aProductService: AProductService,
    protected readonly aProductBlancco: AProductBlancco,
  ) {
    super(aProductService, aProductBlancco);
  }
}
