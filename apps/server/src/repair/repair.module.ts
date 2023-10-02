import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { RepairRepository } from './repair.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrintService } from '../print/print.service';
import { FileModule } from '../file/file.module';
import { OrderStatusModule } from '../admin/order-status/order-status.module';
import { SaleModule } from '../sale/sale.module';
import { AProductModule } from '../aproduct/aproduct.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  providers: [
    RepairService,
    RepairRepository,
    {
      provide: 'IS_REPAIR',
      useValue: true,
    },
    PrintService,
  ],
  controllers: [RepairController],
  imports: [
    PrismaModule,
    SaleModule,
    FileModule,
    CustomerModule,
    AProductModule,
    OrderStatusModule,
  ],
  exports: [RepairService],
})
export class RepairModule {}
