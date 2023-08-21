import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export class AServiceRepository {
  constructor(protected readonly prisma: PrismaService) {}

  create(params: Prisma.aserviceCreateArgs) {
    return this.prisma.aservice.create(params);
  }

  update(params: Prisma.aserviceUpdateArgs) {
    return this.prisma.aservice.update(params);
  }

  delete(id: number) {
    return this.prisma.aservice.delete({ where: { id } });
  }

  deleteMany(ids: number[]) {
    return this.prisma.aservice.deleteMany({ where: { id: { in: ids } } });
  }
}
