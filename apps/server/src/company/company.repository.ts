import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDiscrimination } from './types/company-discrimination.enum';

export class CompanyRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly discr: CompanyDiscrimination
  ) {}

  async findAll(params: Prisma.acompanyFindManyArgs) {
    const { skip, cursor, select, orderBy } = params;
    const where = {
      ...params.where,
      discr: this.discr
    };
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
  
  create(createCompanyDto: CreateCompanyDto) {
    const data: Prisma.acompanyCreateInput = {
      ...createCompanyDto,
      discr: this.discr,
    };
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
