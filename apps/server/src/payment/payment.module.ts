import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentRepository } from './payment.repository';
import { ModuleService } from '../module/module.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  providers: [PaymentService, PaymentRepository, ModuleService, ModuleRepository],
  controllers: [PaymentController],
  imports: [PrismaModule],
})
export class PaymentModule {}
