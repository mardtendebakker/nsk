import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.afile.findMany();
  }
  
  create(data: Prisma.afileCreateInput) {
    return this.prisma.afile.create({
      data
    });
  }
  
  findOne(params: Prisma.afileFindUniqueArgs) {
    const { where, select, include } = params;
    if (include) {
      return this.prisma.afile.findUnique({ where, include });
    }
    return this.prisma.afile.findUnique({ where, select });
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
}