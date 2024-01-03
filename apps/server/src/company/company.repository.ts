import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanyRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService
  ) {}

  async findAll(params: Prisma.companyFindManyArgs) {
    const { skip, cursor, select, orderBy, where } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.company.count({where}),
      this.prisma.company.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  findOne(params: Prisma.companyFindUniqueArgs) {
    return this.prisma.company.findUnique(params);
  }

  create(companyCreateInput: Prisma.companyCreateInput) {
    return this.prisma.company.create({
      data: companyCreateInput
    });
  }

  update(params: {
    where: Prisma.companyWhereUniqueInput;
    data: Prisma.companyUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.company.update({
      data,
      where,
    });
  }
  
  delete(params: {where: Prisma.companyWhereUniqueInput}) {
    const { where } = params;
    return this.prisma.company.delete({where});
  }
}
