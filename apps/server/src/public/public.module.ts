import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { PrintService } from '../print/print.service';
import { PurchaseModule } from '../purchase/purchase.module';
import { FileModule } from '../file/file.module';
import { ProductModule } from '../product/product.module';
import { OrderStatusModule } from '../admin/order-status/order-status.module';
import { HttpModule } from '@nestjs/axios';
import { SaleModule } from '../sale/sale.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [ PublicService, PrintService ],
  controllers: [PublicController],
  imports: [
    HttpModule,
    PurchaseModule,
    SaleModule,
    ContactModule,
    FileModule,
    ProductModule,
    OrderStatusModule
  ],
})
export class PublicModule {}
