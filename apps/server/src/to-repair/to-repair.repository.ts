import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockRepository } from '../stock/stock.repository';
import { IS_REPAIR } from '../repair/types/is-repair.const';

@Injectable()
export class ToRepairRepository extends StockRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, IS_REPAIR);
  }
}
