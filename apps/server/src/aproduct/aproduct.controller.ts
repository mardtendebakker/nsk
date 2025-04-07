import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockController } from '../stock/stock.controller';
import { AProductService } from './aproduct.service';
import { AProductBlancco } from './aproduct.blancco';
import { SecurityService } from '../security/service/security.service';

@ApiTags('aproduct')
@Controller('aproduct')
export class AproductController extends StockController {
  constructor(
    protected readonly aProductService: AProductService,
    protected readonly aProductBlancco: AProductBlancco,
    protected readonly securityService: SecurityService,
  ) {
    super(aProductService, aProductBlancco, securityService);
  }
}
