import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductRepository extends StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly  configService: ConfigService,
    @Inject('IS_REPAIR') protected readonly isRepair: boolean
  ) {
    super(prisma, configService, isRepair);
  }
}
