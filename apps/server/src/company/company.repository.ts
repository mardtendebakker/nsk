import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyType } from './comapny-type.enum';

export class CompanyRepository {
  constructor(
    protected prisma: PrismaService,
    protected type: CompanyType
  ) {}

  async getCompanies(params: Prisma.acompanyFindManyArgs) {
    const {skip, cursor, select, orderBy} = params;
    const take = params.take ? params.take : 20;
    const where = {
      ...params.where,
      discr: this.type
    };
    const submission = await this.prisma.$transaction([
      this.prisma.acompany.count({where}),
      this.prisma.acompany.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
}
