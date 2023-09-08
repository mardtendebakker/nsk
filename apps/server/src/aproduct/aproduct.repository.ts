import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AProductRepository extends StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly  configService: ConfigService
  ) {
    super(prisma, configService);
  }
}
