import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { OrderStatusRepository } from './order-status.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';

@Injectable()
export class OrderStatusService {
  constructor(protected readonly repository: OrderStatusRepository) {}

  async findAll(query: FindManyDto) {
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

  async create(createOrderStatusDto: CreateOrderStatusDto) {
    return this.repository.create({
      data: createOrderStatusDto,
    });
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.repository.update({
      where: { id },
      data: { ...updateOrderStatusDto }
    });
  }

  async delete(id: number) {
    try {
      return await this.repository.delete({
        where: { id },
      });
    } catch (err) {
      if (err.code === 'P2003') {
        throw new ConflictException();
      }

      throw err;
    }
  }

  async findByNameOrCreate(createOrderStatusDto: CreateOrderStatusDto) {
    let orderStatus = await this.repository.findFirst({
      where: { name: createOrderStatusDto.name }
    });

    if (!orderStatus) {
      orderStatus = await this.create(createOrderStatusDto);
    }

    return orderStatus;
  }
}
