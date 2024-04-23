import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CognitoModule } from '../auth/cognito/cognito.module';
import { ModuleService } from '../module/module.service';
import { ModulePaymentService } from '../module-payment/module-payment.service';
import { ModulePaymentRepository } from '../module-payment/module-payment.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleRepository } from '../module/module.repository';

@Module({
  imports: [CognitoModule],
  providers: [UserService, ModuleService, ModuleRepository, ModulePaymentService, ModulePaymentRepository, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
