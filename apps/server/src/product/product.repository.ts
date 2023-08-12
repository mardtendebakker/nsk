import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';

@Injectable()
export class ProductRepository extends StockRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
