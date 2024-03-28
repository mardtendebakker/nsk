import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';

@Injectable()
export class ToRepairRepository extends StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    @Inject('IS_REPAIR') protected readonly isRepair: boolean,
  ) {
    super(prisma, configService, isRepair);
  }
}
