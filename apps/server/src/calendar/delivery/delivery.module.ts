import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryRepository } from './delivery.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { DeliveryController } from './delivery.controller';

@Module({
  providers: [DeliveryService, DeliveryRepository],
  exports: [DeliveryService],
  controllers: [DeliveryController],
  imports: [PrismaModule],
})
export class DeliveryModule {}
