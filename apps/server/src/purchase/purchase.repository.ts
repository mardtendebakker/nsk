import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseRepository extends AOrderRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {
    super(prisma, configService);
  }
}
