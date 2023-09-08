import { Inject, Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SaleRepository extends AOrderRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
    @Inject('IS_REPAIR') protected readonly isRepair?: boolean
  ) {
    super(prisma, configService, isRepair);
  }
}
