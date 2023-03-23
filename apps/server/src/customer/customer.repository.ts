import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../company/company.repository';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerRepository extends CompanyRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, CompanyDiscrimination.CUSTOMER);
  }
}
