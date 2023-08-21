import { Prisma } from '@prisma/client';
import { AServiceRepository } from './aservice.repository';
import { UpdateServiceDto } from './dto/update-aservice.dto';
import { AServiceDiscrimination } from './enum/aservice-discrimination.enum';
import { CreateServiceDto } from './dto/create-service.dto';
import { AServiceStatus } from './enum/aservice-status.enum';

export class AServiceService {
  constructor(
    protected readonly repository: AServiceRepository,
    protected readonly type: AServiceDiscrimination,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    const { product_order_id, status, ...rest } = createServiceDto;

    const params: Prisma.aserviceCreateArgs = {
      data: {
        discr: this.type,
        relation_id: product_order_id,
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

  delete(id: number) {
    return this.repository.delete(id);
  }
}
