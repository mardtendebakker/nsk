import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { PrintService } from '../print/print.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [OrderService, OrderRepository, PrintService],
  controllers: [OrderController],
  imports: [PrismaModule]
})
export class OrderModule {}
