import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PickupRepository {
  constructor(
    private readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async findAll(params: Prisma.pickupFindManyArgs) {
    const {
      skip, cursor, where, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.pickup.count({ where }),
      this.prisma.pickup.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  create(params: Prisma.pickupCreateArgs) {
    return this.prisma.pickup.create(params);
  }
}
