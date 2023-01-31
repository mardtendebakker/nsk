import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async getCustomers(params: Prisma.acompanyFindManyArgs) {
    const {skip, cursor, select, orderBy} = params;
    const take = params.take ? params.take : 20;
    const where = {
      ...params.where,
      discr: 'c'
    };
    return this.prisma.acompany.findMany({ skip, take, cursor, where, select, orderBy });
  }
}
