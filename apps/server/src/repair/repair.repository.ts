import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleRepository } from '../sale/sale.repository';

@Injectable()
export class RepairRepository extends SaleRepository {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject('IS_REPAIR') protected readonly isRepair: boolean
  ) {
    super(prisma, isRepair);
  }
}
