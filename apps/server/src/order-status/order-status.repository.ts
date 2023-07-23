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
  
  findOne(params: Prisma.order_statusFindUniqueArgs) {
    return this.prisma.order_status.findUnique(params);
  }
  
  findFirst(params: Prisma.order_statusFindFirstArgs) {
    return this.prisma.order_status.findFirst(params);
  }

  update(params: Prisma.order_statusUpdateArgs) {

    return this.prisma.order_status.update(params);
  }

  create(params: Prisma.order_statusCreateArgs) {

    return this.prisma.order_status.create(params);
  }
}
