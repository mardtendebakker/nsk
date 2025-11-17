import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductLogRepository {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll(params: any) {
    const {
      skip, cursor, where, orderBy,
    } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.product_log.count({ where }),
      this.prisma.product_log.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  create(params: Prisma.product_logCreateArgs) {
    return this.prisma.product_log.create(params);
  }
}

