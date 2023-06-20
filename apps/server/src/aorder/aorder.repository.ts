import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AOrder } from './dto/update-many-aorder.dto';

export class AOrderRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.aorderFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.aorder.count({ where }),
      this.prisma.aorder.findMany({ skip, take, cursor, where, select, orderBy })
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findBy(params: Prisma.aorderFindManyArgs) {
    const { where, select, orderBy } = params;
    return this.prisma.aorder.findMany({ where, select, orderBy })
  }

  create(params: Prisma.aorderCreateArgs) {
    return this.prisma.aorder.create(params);
  }

  findOne(params: Prisma.aorderFindUniqueArgs) {
    return this.prisma.aorder.findUnique(params);
  }

  update(params: Prisma.aorderUpdateArgs) {

    return this.prisma.aorder.update(params);
  }

  updateMany(params: {
    where: Prisma.aorderWhereInput;
    data: AOrder;
  }) {
    const { where, data } = params;
    return this.prisma.aorder.updateMany({
      data,
      where,
    });
  }

  deleteMany(ids: number[]) {
    return this.prisma.aorder.deleteMany({ where: { id: { in: ids } } })
  }
}
