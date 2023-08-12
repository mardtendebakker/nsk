import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';
import { IS_SERVICE } from '../service/types/is-service.enum';

@Injectable()
export class RepairRepository extends StockRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, IS_SERVICE);
  }
}
