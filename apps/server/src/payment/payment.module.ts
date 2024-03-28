import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentRepository } from './payment.repository';
import { ModuleService } from '../module/module.service';

@Module({
  providers: [PaymentService, PaymentRepository, ModuleService],
  controllers: [PaymentController],
  imports: [PrismaModule],
})
export class PaymentModule {}
