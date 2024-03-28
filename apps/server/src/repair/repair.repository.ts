import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SaleRepository } from '../sale/sale.repository';

@Injectable()
export class RepairRepository extends SaleRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    @Inject('IS_REPAIR') protected readonly isRepair: boolean,
  ) {
    super(prisma, configService, isRepair);
  }
}
