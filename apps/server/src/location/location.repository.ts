import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.location.findMany();
  }
  
  create(data: Prisma.locationCreateInput) {
    return this.prisma.location.create({
      data
    });
  }
  
  findOne(params: Prisma.locationFindUniqueArgs) {
    const { where, select, include } = params;
    if (include) {
      return this.prisma.location.findUnique({ where, include });
    }
    return this.prisma.location.findUnique({ where, select });
  }
  
  update(params: {
    where: Prisma.locationWhereUniqueInput;
    data: Prisma.locationUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.location.update({
      data,
      where,
    });
  }
  
  async findAll(params: Prisma.locationFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.location.count({where}),
      this.prisma.location.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
}
