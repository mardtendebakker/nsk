import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeliveryRepository {
  constructor(
    private readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async findAll(params: Prisma.aorderFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.aorder.count({ where }),
      this.prisma.aorder.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  8;
}
