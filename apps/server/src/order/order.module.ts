import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrintService } from '../print/print.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [OrderService, OrderRepository, PrintService],
  controllers: [OrderController],
  imports: [PrismaModule,  FileModule, ContactModule]
})
export class OrderModule {}
