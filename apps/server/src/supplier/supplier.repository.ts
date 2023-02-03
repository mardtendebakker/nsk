import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../company/company.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierRepository extends CompanyRepository {
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }
}
