import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {
    // TODO: prisma middleware for updateAt
    prisma.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'create') {
        params.args.data.price *= 100;
        return  await next(params);
      }
      return next(params);
    });

    prisma.$use(async (params, next) => {
      if (params.model == 'product' && ['findFirst', 'findUnique'].includes(params.action) ) {
        const product = await next(params);
        return {
          ...product,
          price: product.price / 100,
        };
      }
      return next(params);
    });

    prisma.$use(async (params, next) => {
      if (params.model == 'product' && params.action == 'findMany' ) {
        const products = await next(params);
        return products.map(product => ({
          ...product,
          price: product.price / 100,
        }));
      }
      return next(params);
    });
  }

  async findAll(params: Prisma.productFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.product.count({where}),
      this.prisma.product.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  create(data: Prisma.productCreateInput) {
    return this.prisma.product.create({
      data
    });
  }
  
  findOne(params: Prisma.productFindUniqueArgs) {
    const { where, select, include } = params;
    return this.prisma.product.findUnique({ where, select });
  }
  
  update(params: {
    where: Prisma.productWhereUniqueInput;
    data: Prisma.productUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.product.update({
      data,
      where,
    });
  }
}
