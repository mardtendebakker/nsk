import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationLabelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst(params: Prisma.location_labelFindFirstArgs) {
    return this.prisma.location_label.findFirst(params);
  }

  async create(params: Prisma.location_labelCreateArgs) {
    return this.prisma.location_label.create(params);
  }
}
