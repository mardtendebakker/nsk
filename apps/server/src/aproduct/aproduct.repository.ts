import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';

@Injectable()
export class AProductRepository extends StockRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {
    super(prisma, configService);
  }
}
