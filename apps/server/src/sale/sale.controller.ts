import { Body, Controller, Delete, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { AOrderController } from '../aorder/aorder.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportDto } from './dto/import-dto';
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

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importSales(
    @Body() body: ImportDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.saleService.import(body, file);
  }
}
