import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderStatusRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.order_statusFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.order_status.count({where}),
      this.prisma.order_status.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
}
