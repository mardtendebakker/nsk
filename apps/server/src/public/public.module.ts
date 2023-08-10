import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { PrintService } from '../print/print.service';
import { PurchaseModule } from '../purchase/purchase.module';
import { SupplierModule } from '../supplier/supplier.module';
import { FileModule } from '../file/file.module';
import { ProductModule } from '../product/product.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ PublicService, PrintService ],
  controllers: [PublicController],
  imports: [
    HttpModule,
    PurchaseModule,
    SupplierModule,
    FileModule,
    ProductModule,
    OrderStatusModule
  ],
})
export class PublicModule {}
