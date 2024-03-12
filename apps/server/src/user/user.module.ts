import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ModuleService } from '../module/module.service';
import { ModulePaymentService } from '../module_payment/module_payment.service';
import { ModulePaymentRepository } from '../module_payment/module_payment.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [UserService, ModuleService, ModulePaymentService, ModulePaymentRepository, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
