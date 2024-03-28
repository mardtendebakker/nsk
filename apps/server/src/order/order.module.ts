import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { ContactModule } from '../contact/contact.module';
import { PrintModule } from '../print/print.module';

@Module({
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  imports: [PrismaModule, FileModule, ContactModule, PrintModule],
})
export class OrderModule {}
