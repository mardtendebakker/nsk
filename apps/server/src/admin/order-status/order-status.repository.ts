import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderStatusRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async findAll(params: Prisma.order_statusFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.order_status.count({ where }),
      this.prisma.order_status.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  async findOne(params: Prisma.order_statusFindUniqueArgs) {
    return this.prisma.order_status.findUnique(params);
  }

  async findFirst(params: Prisma.order_statusFindFirstArgs) {
    return this.prisma.order_status.findFirst(params);
  }

  async create(params: Prisma.order_statusCreateArgs) {
    return this.prisma.order_status.create(params);
  }

  async update(params: Prisma.order_statusUpdateArgs) {
    return this.prisma.order_status.update(params);
  }

  async delete(params: Prisma.order_statusDeleteArgs) {
    return this.prisma.order_status.delete(params);
  }
}
