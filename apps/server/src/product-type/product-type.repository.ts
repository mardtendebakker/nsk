import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductTypeRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.product_typeFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
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
}
