import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export class CompanyRepository {
  constructor(protected prisma: PrismaService) {}

  async findAll(params: Prisma.acompanyFindManyArgs) {
    const {skip, cursor, where, select, orderBy} = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.acompany.count({where}),
      this.prisma.acompany.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  create(data: Prisma.acompanyCreateInput) {
    return this.prisma.acompany.create({
      data
    })
  }
}
