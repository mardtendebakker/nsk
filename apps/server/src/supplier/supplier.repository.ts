import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../company/company.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';

@Injectable()
export class SupplierRepository extends CompanyRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  findAll(params: Prisma.acompanyFindManyArgs){
      return super.findAll({
        ...params,
        where: {
          ...params.where,
          discr: CompanyDiscrimination.SUPLLIER
        }
      });
  }

  create(createCompanyDto: Prisma.acompanyCreateInput){
      return super.create({
        ...createCompanyDto,
        discr: CompanyDiscrimination.SUPLLIER
      })
  }
}
