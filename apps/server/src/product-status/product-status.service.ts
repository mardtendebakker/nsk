import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { ProductStatusRepository } from './product-status.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductStatusService {
  constructor(protected readonly repository: ProductStatusRepository) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        id: {
          in: query.ids
        },
        name: {
          contains: query.search
        }
      }
    });
  }

  async findOne(id: number) {
    const params: Prisma.product_statusFindUniqueArgs = {
      where: { id }
    };

    return this.repository.findOne(params);
  }

  update(id: number, updateOrderStatusDto: UpdateProductStatusDto) {

    return this.repository.update({
      where: { id },
      data: { ...updateOrderStatusDto }
    });
  }
}
