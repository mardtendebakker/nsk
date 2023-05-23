import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleRepository extends AOrderRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
