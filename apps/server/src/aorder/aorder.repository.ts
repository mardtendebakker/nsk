import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AOrder } from './dto/update-many-aorder.dto';

export class AOrderRepository {
  private serviceWhere: Prisma.aorderWhereInput = {};

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    protected readonly isRepair?: boolean,
  ) {
    this.serviceWhere = {
      repair: { ...(isRepair ? { isNot: null } : { is: null }) },
    };
  }

  async findAll(params: Prisma.aorderFindManyArgs) {
    const {
      skip, cursor, select, orderBy,
    } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take)
    && params.take < maxQueryLimit ? params.take : maxQueryLimit;
    const {
      repair,
      ...restWhere
    } = params.where;
    const where: Prisma.aorderWhereInput = {
      ...(repair ? { repair } : this.serviceWhere),
      ...restWhere,
    };
    const submission = await this.prisma.$transaction([
      this.prisma.aorder.count({ where }),
      this.prisma.aorder.findMany({
        skip, take, cursor, where, select, orderBy,
      }),
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findBy(params: Prisma.aorderFindManyArgs) {
    return this.prisma.aorder.findMany(params);
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
    return this.prisma.aorder.deleteMany({ where: { id: { in: ids } } });
  }

  deleteOne(id: number) {
    return this.prisma.aorder.delete({ where: { id } });
  }

  deletePickup(id: number) {
    return this.prisma.pickup.delete({ where: { id } });
  }
}
