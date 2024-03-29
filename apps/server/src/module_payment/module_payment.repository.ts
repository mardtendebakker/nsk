import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulePaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLastValidModulePaymentByModule(moduleName: string) {
    const dateNow = new Date();

    return (await this.prisma.module_payment.findMany({
      select: {
        id: true,
        payment_id: true,
        price: true,
        expires_at: true,
        active_at: true,
        payment: true,
        module: true,
      },
      where: {
        active_at: { lte: dateNow },
        module: {
          name: { equals: moduleName },
        },
        payment: {
          status: 'paid',
        },
      },
      orderBy: {
        active_at: 'desc',
      },
      take: 1,
    }))[0];
  }
}
