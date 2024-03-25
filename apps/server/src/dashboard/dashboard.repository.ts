import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DashboardRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  companyCount(params: Prisma.companyFindManyArgs) {
    const { where } = params;

    return this.prisma.company.count({where});
  }

  orderCount(params: Prisma.aorderFindManyArgs) {
    const { where } = params;

    return this.prisma.aorder.count({where});
  }
}