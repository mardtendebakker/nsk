import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { OrderStatusRepository } from './order-status.repository';
import { Injectable } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderStatusService {
  constructor(protected readonly repository: OrderStatusRepository) {}

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
    const params: Prisma.order_statusFindUniqueArgs = {
      where: { id }
    };

    return this.repository.findOne(params);
  }

  update(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {

    return this.repository.update({
      where: { id },
      data: { ...updateOrderStatusDto }
    });
  }
}
