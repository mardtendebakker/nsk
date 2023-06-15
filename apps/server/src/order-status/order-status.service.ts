import { FindManyDto } from './dto/find-many.dto';
import { OrderStatusRepository } from './order-status.repository';
import { Injectable } from '@nestjs/common';

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
          contains: query.nameContains
        }
      }
    });
  }
}
