import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

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
}
