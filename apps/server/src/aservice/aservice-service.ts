import { Prisma } from '@prisma/client';
import { AServiceRepository } from './aservice.repository';
import { UpdateServiceDto } from './dto/update-aservice.dto';
import { AServiceDiscrimination } from './enum/aservice-discrimination.enum';
import { CreateServiceDto } from './dto/create-service.dto';
import { AServiceStatus } from './enum/aservice-status.enum';
import { UnprocessableEntityException } from '@nestjs/common';

export class AServiceService {
  constructor(
    protected readonly repository: AServiceRepository,
    protected readonly type: AServiceDiscrimination,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    const { product_order_id, task_id, status, ...rest } = createServiceDto;

    if (
      (product_order_id === undefined && task_id === undefined) ||
      (product_order_id !== undefined && task_id !== undefined)
    ) {
      throw new UnprocessableEntityException('Either product_order_id or task_id should be provided, but not both!');
    }

    const params: Prisma.aserviceCreateArgs = {
      data: {
        discr: this.type,
        ...(product_order_id && { relation_id: product_order_id }),
        status: status ?? AServiceStatus.STATUS_TODO,
        ...rest,
      },
    };

    return this.repository.create(params);
  }

  update(id: number, body: UpdateServiceDto) {
    const params: Prisma.aserviceUpdateArgs = {
      where: { id },
      data: body,
    };

    return this.repository.update(params);
  }
}
