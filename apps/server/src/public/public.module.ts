import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { PurchaseModule } from '../purchase/purchase.module';
import { FileModule } from '../file/file.module';
import { ProductModule } from '../product/product.module';
import { OrderStatusModule } from '../admin/order-status/order-status.module';
import { SaleModule } from '../sale/sale.module';
import { ContactModule } from '../contact/contact.module';
import { PrintModule } from '../print/print.module';

@Module({
  providers: [PublicService],
  controllers: [PublicController],
  imports: [
    HttpModule,
    PurchaseModule,
    SaleModule,
    ContactModule,
    FileModule,
    ProductModule,
    OrderStatusModule,
    PrintModule,
  ],
})
export class PublicModule {}
