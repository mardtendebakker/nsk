import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PickupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: Prisma.pickupFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.pickup.count({where}),
      this.prisma.pickup.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  create(params: Prisma.pickupCreateArgs) {
    
    return this.prisma.pickup.create(params);
  }
}
