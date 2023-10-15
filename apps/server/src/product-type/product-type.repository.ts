import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductTypeRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.product_typeFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.product_type.count({where}),
      this.prisma.product_type.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  findOne(params: Prisma.product_typeFindUniqueArgs) {
    return this.prisma.product_type.findUnique(params);
  }

  update(params: Prisma.product_typeUpdateArgs) {
    return this.prisma.product_type.update(params);
  }

  create(params: Prisma.product_typeCreateArgs) {
    return this.prisma.product_type.create(params);
  }
}
