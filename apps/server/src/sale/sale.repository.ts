import { Inject, Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleRepository extends AOrderRepository {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject('IS_REPAIR') protected readonly isRepair?: boolean
  ) {
    super(prisma, isRepair);
  }
}
