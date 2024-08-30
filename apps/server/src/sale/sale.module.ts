import { Global, Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { AProductModule } from '../aproduct/aproduct.module';
import { OrderStatusModule } from '../admin/order-status/order-status.module';
import { ContactModule } from '../contact/contact.module';
import { PrintModule } from '../print/print.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Global()
@Module({
  providers: [
    SaleService,
    SaleRepository,
    {
      provide: 'IS_REPAIR',
      useValue: false,
    },
  ],
  controllers: [SaleController],
  imports: [
    PrismaModule,
    FileModule,
    ContactModule,
    AProductModule,
    OrderStatusModule,
    PrintModule,
    RabbitMQModule,
  ],
  exports: [SaleService],
})
export class SaleModule {}
