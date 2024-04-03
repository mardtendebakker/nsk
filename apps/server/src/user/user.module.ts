import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ModuleService } from '../module/module.service';
import { ModulePaymentService } from '../module-payment/module-payment.service';
import { ModulePaymentRepository } from '../module-payment/module-payment.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  imports: [AuthModule],
  providers: [UserService, ModuleService, ModuleRepository, ModulePaymentService, ModulePaymentRepository, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
