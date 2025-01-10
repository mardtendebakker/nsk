import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModuleRepository {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  async findAll(params: Prisma.moduleFindManyArgs = {}) {
    const {
      where, skip, cursor, select, orderBy,
    } = params;

    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take < maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.module.count({ where }),
      this.prisma.module.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  async findOne(params: Prisma.moduleFindUniqueArgs) {
    return this.prisma.module.findUnique(params);
  }

  async update(params: Prisma.moduleUpdateArgs) {
    await this.prisma.module.update(params);
  }
}
