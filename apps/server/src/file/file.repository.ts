import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll(where: Prisma.afileWhereInput) {
    return this.prisma.afile.findMany({ where });
  }

  create(data: Prisma.afileCreateInput) {
    return this.prisma.afile.create({
      data,
    });
  }

  findOne(params: Prisma.afileFindUniqueArgs) {
    const { where, select, include } = params;
    if (include) {
      return this.prisma.afile.findUnique({ where, include });
    } if (select) {
      return this.prisma.afile.findUnique({ where, select });
    }
    return this.prisma.afile.findUnique({ where });
  }

  update(params: {
    where: Prisma.afileWhereUniqueInput;
    data: Prisma.afileUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.afile.update({
      data,
      where,
    });
  }

  delete(where: Prisma.afileWhereUniqueInput) {
    return this.prisma.afile.delete({ where });
  }

  deleteMany(where: Prisma.afileWhereInput) {
    return this.prisma.afile.deleteMany({ where });
  }
}
