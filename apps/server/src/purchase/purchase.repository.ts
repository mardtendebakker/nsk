import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseRepository extends AOrderRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
