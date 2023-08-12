import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { IS_SERVICE } from './types/is-service.enum';

@Injectable()
export class ServiceRepository extends AOrderRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, IS_SERVICE);
  }
}
