import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PurchaseRepository extends AOrderRepository{
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {
    super(prisma, configService);
  }
}
