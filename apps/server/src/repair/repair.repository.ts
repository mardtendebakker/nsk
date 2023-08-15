import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { IS_REPAIR } from './types/is-repair.const';

@Injectable()
export class RepairRepository extends AOrderRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, IS_REPAIR);
  }
}
