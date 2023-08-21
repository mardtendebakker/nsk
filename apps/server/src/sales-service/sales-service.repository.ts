import { Injectable } from '@nestjs/common';
import { AServiceRepository } from '../aservice/aservice.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesServiceRepository extends AServiceRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
