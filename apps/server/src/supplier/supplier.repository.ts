import { Injectable } from '@nestjs/common';
import { CompanyType } from '../company/comapny-type.enum';
import { CompanyRepository } from '../company/company.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierRepository extends CompanyRepository {
  constructor(protected prisma: PrismaService) {
    super(prisma, CompanyType.SUPLLIER)
  }
}
