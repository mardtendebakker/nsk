import { FindCompanyQueryDto } from './dto/find-company-query.dto';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDiscrimination } from './types/comapny-discrimination.enum';
import { UpdateCompanyDto } from './dto/update-company.dto';

export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    protected type: CompanyDiscrimination
  ) {}

  findAll(queryOptions: FindCompanyQueryDto) {
    return this.repository.findAll({
      ...queryOptions,
      where: {
        ...queryOptions.where,
        discr: this.type
      },
      select: {
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
    });
  }

  async create(comapny: CreateCompanyDto) {
    return this.repository.create({
      ...comapny,
      discr: this.type
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
