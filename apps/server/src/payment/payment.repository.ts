import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PAID } from './status';
import { add } from 'date-fns';

@Injectable()
export class PaymentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.paymentFindManyArgs) {
    const { where, skip, cursor, select, orderBy } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.payment.count({where}),
      this.prisma.payment.findMany({ skip, take, cursor, where, select, orderBy })
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findOne(id: number) {
    return this.prisma.payment.findFirst({ where: {id} });
  }

  create(params: Prisma.paymentCreateArgs) {
    return this.prisma.payment.create(params);
  }

  update(params: {
    where: Prisma.paymentWhereInput;
    data: Prisma.paymentUpdateInput;
  }) {
    return this.prisma.payment.updateMany(params);
  }

  async updateToPaidStatus({ transactionId, method } : {transactionId: string, method: string}) {
    await this.prisma.$transaction(async (tx) => {
      const dateNow = new Date();

      await tx.payment.updateMany({
        data: { status: PAID, method }, 
        where: { transaction_id: { equals: transactionId } } 
      });
      await tx.module_payment.updateMany({
        data: { active_at: dateNow, expires_at: add(dateNow, { months: 1 }) },
        where: {payment : {transaction_id: {equals: transactionId}}}
      });
    });
  }
}
