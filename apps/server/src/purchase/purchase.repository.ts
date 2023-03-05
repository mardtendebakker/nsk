import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseRepository extends OrderRepository{
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }
}