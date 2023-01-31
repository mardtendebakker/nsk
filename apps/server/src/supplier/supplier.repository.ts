import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierRepository {
  constructor(private prisma: PrismaService) {}

  async getSuppliers(params: Prisma.acompanyFindManyArgs) {
    const {skip, cursor, select, orderBy} = params;
    const take = params.take ? params.take : 20;
    const where = {
      ...params.where,
      discr: 's'
    };
    return this.prisma.acompany.findMany({ skip, take, cursor, where, select, orderBy });
  }
}
