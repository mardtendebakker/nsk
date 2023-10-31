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

  async findAll(params: Prisma.acompanyFindManyArgs) {
    const { skip, cursor, select, orderBy, where } = params;
    const maxQueryLimit = this.configService.get<number>('MAX_NONE_RELATION_QUERY_LIMIT');
    const take = Number.isFinite(params.take) && params.take <  maxQueryLimit ? params.take : maxQueryLimit;

    const submission = await this.prisma.$transaction([
      this.prisma.acompany.count({where}),
      this.prisma.acompany.findMany({ skip, take, cursor, where, select, orderBy })
    ]);
  
    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }
  
  create(companyCreateArgs: Prisma.acompanyCreateArgs) {
    return this.prisma.acompany.create(companyCreateArgs);
  }
  
  findOne(where: Prisma.acompanyWhereUniqueInput) {
    return this.prisma.acompany.findUnique({
      where,
    });
  }

  findFirst(params: Prisma.acompanyFindFirstArgs) {
    return this.prisma.acompany.findFirst(params);
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

  delete(params: {where: Prisma.acompanyWhereUniqueInput}) {
    const { where } = params;
    return this.prisma.acompany.delete({where});
  }
}
