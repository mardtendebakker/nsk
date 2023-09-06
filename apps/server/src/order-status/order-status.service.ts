import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { OrderStatusRepository } from './order-status.repository';
import { Injectable } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';

@Injectable()
export class OrderStatusService {
  constructor(protected readonly repository: OrderStatusRepository) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        ...query.where,
        ...(query.search && { name: { contains: query.search } }),
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

  create(params: Prisma.order_statusCreateArgs) {

    return this.repository.create(params);
  }

  async findByNameOrCreate(createOrderStatusDto: CreateOrderStatusDto) {
    let orderStatus = await this.repository.findFirst({
      where: { name: createOrderStatusDto.name }
    });

    if (!orderStatus) {
      orderStatus = await this.create({ data: createOrderStatusDto });
    }

    return orderStatus;
  }
}
