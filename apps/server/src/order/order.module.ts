import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderRepository } from './order.repository';

@Module({
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  imports: [PrismaModule]
})
export class OrderModule {}
