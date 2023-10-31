import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductStatusRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.product_statusFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.product_status.count({where}),
      this.prisma.product_status.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  findOne(params: Prisma.product_statusFindUniqueArgs) {
    return this.prisma.product_status.findUnique(params);
  }

  update(params: Prisma.product_statusUpdateArgs) {
    return this.prisma.product_status.update(params);
  }

  create(params: Prisma.product_statusCreateArgs) {
    return this.prisma.product_status.create(params);
  }
}
