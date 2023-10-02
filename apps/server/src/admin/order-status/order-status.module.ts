import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderStatusService } from './order-status.service';
import { OrderStatusRepository } from './order-status.repository';
import { OrderStatusController } from './order-status.controller';

@Module({
  providers: [OrderStatusService, OrderStatusRepository],
  controllers: [OrderStatusController],
  imports: [PrismaModule],
  exports: [OrderStatusService]
})
export class OrderStatusModule {}
