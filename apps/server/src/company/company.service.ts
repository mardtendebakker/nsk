import { CompanyRepository } from './company.repository';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindManyDto } from './dto/find-many.dto';
import { CompanyDiscrimination } from './types/company-discrimination.enum';

export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    protected readonly type: CompanyDiscrimination,
  ) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      select: {
        ...query.select,
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
      where: {
        ...query.where,
        discr: this.type,
        name: {
          contains: query.nameContains
        },
        ...(query.partnerOnly == 1 && {is_partner: {gt: 0}})
      }
    });
  }

  async create(comapny: CreateCompanyDto) {
    return this.repository.create({
      ...comapny,
      discr: this.type,
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async update(id: number, comapny: UpdateCompanyDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
  }
}
