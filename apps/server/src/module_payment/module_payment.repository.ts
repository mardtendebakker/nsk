import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Module } from '../module/module.service';

@Injectable()
export class ModulePaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLastValidModulePaymentByModule(moduleName: Module) {
    const dateNow = new Date();

    return (await this.prisma.module_payment.findMany({
      select: {
        id: true,
        module_name: true,
        payment_id: true,
        price: true,
        expires_at: true,
        active_at: true,
        payment: true,
      },
      where: {
        active_at: { lte: dateNow },
        module_name: {equals: moduleName.name},
        payment: {
          status: 'paid',
        }
      },
      orderBy: {
        active_at: 'desc'
      },
      take: 1
    }))[0];
  }
}
