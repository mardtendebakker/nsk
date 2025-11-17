import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { ProductLogRepository } from './product-log.repository';

@Injectable()
export class ProductLogService {
  constructor(
    private repository: ProductLogRepository,
  ) {}

  findAll(query: FindManyDto) {
    const where: Prisma.product_logWhereInput = { };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { sku: { contains: query.search } },
        { order_nr: { contains: query.search } },
      ];
    }

    return this.repository.findAll({ ...query, where, orderBy: { created_at: 'desc' } });
  }

  create(data: Prisma.product_logCreateInput) {
    return this.repository.create({ data });
  }
}

