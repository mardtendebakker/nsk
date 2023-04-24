import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../company/company.repository';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerRepository extends CompanyRepository{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  findAll(params: Prisma.acompanyFindManyArgs){
      return super.findAll({
        ...params,
        where: {
          ...params.where,
          discr: CompanyDiscrimination.CUSTOMER
        }
      });
  }

  create(createCompanyDto: Prisma.acompanyCreateInput){
      return super.create({
        ...createCompanyDto,
        discr: CompanyDiscrimination.CUSTOMER
      })
  }
}
