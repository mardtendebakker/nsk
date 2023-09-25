import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';
import { AProductModule } from '../aproduct/aproduct.module';
import { OrderStatusModule } from '../order-status/order-status.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  providers: [
    SaleService,
    SaleRepository,
    {
      provide: 'IS_REPAIR',
      useValue: false,
    },
    PrintService,
  ],
  controllers: [SaleController],
  imports: [
    PrismaModule,
    FileModule,
    CustomerModule,
    AProductModule,
    OrderStatusModule,
  ],
  exports: [SaleService],
})
export class SaleModule {}
