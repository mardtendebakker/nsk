import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FleetGoService } from './fleet-go.service';
import { ModuleService } from '../module/module.service';
import { ModulePaymentService } from '../module-payment/module-payment.service';
import { ModuleRepository } from '../module/module.repository';
import { ModulePaymentRepository } from '../module-payment/module-payment.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FleetGoService, ModuleService, ModulePaymentService, ModuleRepository, ModulePaymentRepository, ConfigService, PrismaService],
  exports: [FleetGoService],
})

export class FleetGoModule { }
