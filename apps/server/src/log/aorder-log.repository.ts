import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AorderLogRepository {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAll(params: any) {
    const {
      skip, cursor, where, orderBy,
    } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.aorder_log.count({ where }),
      this.prisma.aorder_log.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          previous_status: true,
          status: true,
        },
      } as any),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  create(params: Prisma.aorder_logCreateArgs) {
    return this.prisma.aorder_log.create(params);
  }
}

