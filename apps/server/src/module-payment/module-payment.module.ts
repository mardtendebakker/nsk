import { Global, Module } from '@nestjs/common';
import { ModulePaymentService } from './module-payment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ModulePaymentRepository } from './module-payment.repository';

@Global()
@Module({
  providers: [ModulePaymentService, ModulePaymentRepository],
  exports: [ModulePaymentService],
  imports: [PrismaModule],
})
export class ModulePaymentModule {}
