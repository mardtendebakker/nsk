import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { RepairRepository } from './repair.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { OrderStatusModule } from '../admin/order-status/order-status.module';
import { SaleModule } from '../sale/sale.module';
import { AProductModule } from '../aproduct/aproduct.module';
import { ContactModule } from '../contact/contact.module';
import { PrintModule } from '../print/print.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  providers: [
    RepairService,
    RepairRepository,
    {
      provide: 'IS_REPAIR',
      useValue: true,
    },
  ],
  controllers: [RepairController],
  imports: [
    PrismaModule,
    SaleModule,
    FileModule,
    ContactModule,
    AProductModule,
    OrderStatusModule,
    PrintModule,
    RabbitMQModule,
  ],
  exports: [RepairService],
})
export class RepairModule {}
