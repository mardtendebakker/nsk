import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleRepository extends OrderRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
