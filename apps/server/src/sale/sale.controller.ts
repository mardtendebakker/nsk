import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { AOrderController } from '../aorder/aorder.controller';
@ApiTags('sales')
@Controller('sales')
export class SaleController extends AOrderController {
  constructor(protected readonly saleService: SaleService) {
    super(saleService);
  }

  @Put(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  addProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.addProducts(id, productIds);
  }

  @Delete(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  removeProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.removeProducts(id, productIds);
  }
}
