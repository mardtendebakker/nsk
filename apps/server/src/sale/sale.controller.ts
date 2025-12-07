import {
  Body, Controller, Delete, ForbiddenException, Headers, Param, Post, Put, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SaleService } from './sale.service';
import { AOrderController } from '../aorder/aorder.controller';
import { ImportDto } from './dto/import-dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ConnectedUser, ConnectedUserType } from '../security/decorator/connected-user.decorator';
import { MANAGER_GROUPS, SALE_UPLOADER_GROUPS, Group } from '../user/model/group.enum';
import { Authorization } from '../security/decorator/authorization.decorator';

@ApiTags('sales')
@Controller('sales')
export class SaleController extends AOrderController {
  constructor(
    protected readonly saleService: SaleService,
    protected readonly rabbitMQService: RabbitMQService,
  ) {
    super(saleService);
  }

  @Put(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  addProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.addProducts(id, productIds.map((productId) => ({ productId, quantity: 1 })));
  }

  @Delete(':id/products')
  @ApiBody({ type: [Number], description: 'Array of product IDs' })
  removeProducts(@Param('id') id: number, @Body() productIds: number[]) {
    return this.saleService.removeProducts(id, productIds);
  }

  @Post(':id/request-exact-invoice')
  requestInvoice(@Param('id') id: number, @Headers('exact-authorization') authorization) {
    return this.saleService.requestExactInvoice(id, { token: authorization?.replace('Bearer ', '') || '' });
  }

  @Post('import')
  @Authorization(SALE_UPLOADER_GROUPS)
  @UseInterceptors(FileInterceptor('file'))
  importSales(
  @Body() body: ImportDto,
    @UploadedFile() file: Express.Multer.File,
    @ConnectedUser() { groups, email }: ConnectedUserType,
  ) {
    if (groups.some((group) => MANAGER_GROUPS.includes(group))) {
      return this.saleService.import(body, file);
    } if (groups.some((group) => [Group.PARTNER_SALE_UPLOADER].includes(group))) {
      return this.saleService.import(body, file, email);
    }
    throw new ForbiddenException('Insufficient permissions to access this api!');
  }

  @Post('bulk/publish-from-store')
  @ApiBody({ type: [String], description: 'Array of order IDs' })
  async publishFromStore(@Body() ids: string[]): Promise<boolean> {
    await Promise.all(ids.map(async (id) => this.rabbitMQService.publishOrderFromStore(id)));
    return true;
  }
}
