import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleRepository } from '../sale/sale.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RepairRepository extends SaleRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    @Inject('IS_REPAIR') protected readonly isRepair: boolean
  ) {
    super(prisma, configService, isRepair);
  }
}
