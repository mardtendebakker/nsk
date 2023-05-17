import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from './dto/update-many-order.dto';

export class OrderRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async getOrders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.aorderWhereUniqueInput;
    where?: Prisma.aorderWhereInput;
    select?: Prisma.aorderSelect;
    orderBy?: Prisma.aorderOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, select, orderBy } = params;
    return this.prisma.aorder.findMany({ skip, take, cursor, where, select, orderBy });
  }

  async findAll(params: Prisma.aorderFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.aorder.count({where}),
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
  
  create(data: Prisma.aorderCreateInput) {
    return this.prisma.aorder.create({
      data
    });
  }
  
  findOne(where: Prisma.aorderWhereUniqueInput) {
    return this.prisma.aorder.findUnique({
      where,
    });
  }
  
  update(params: {
    where: Prisma.aorderWhereUniqueInput;
    data: Prisma.aorderUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.aorder.update({
      data,
      where,
    });
  }
  
  updateMany(params: {
    where: Prisma.aorderWhereInput;
    data: Order;
  }) {
    const { where, data } = params;
    return this.prisma.aorder.updateMany({
      data,
      where,
    });
  }

  deleteMany(ids: number[]) {
    return this.prisma.aorder.deleteMany({where: {id : {in: ids}}})
  }
}
