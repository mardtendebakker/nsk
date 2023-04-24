import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(params: Prisma.acompanyFindManyArgs) {
    const { skip, cursor, select, orderBy, where } = params;
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
  
  create(createCompanyDto: Prisma.acompanyCreateInput) {
    const data: Prisma.acompanyCreateInput = createCompanyDto;
    return this.prisma.acompany.create({
      data
    });
  }
  
  findOne(where: Prisma.acompanyWhereUniqueInput) {
    return this.prisma.acompany.findUnique({
      where,
    });
  }
  
  update(params: {
    where: Prisma.acompanyWhereUniqueInput;
    data: Prisma.acompanyUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.acompany.update({
      data,
      where,
    });
  }
}
