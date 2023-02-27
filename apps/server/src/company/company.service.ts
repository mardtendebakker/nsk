import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyDiscrimination } from './types/company-discrimination.enum';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FindManyDto } from '../common/dto/find-many.dto';

export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
    protected type: CompanyDiscrimination
  ) {}

  findAll(query: FindManyDto) {
    return this.repository.findAll({
      ...query,
      where: {
        ...query.where,
        discr: this.type
      },
      select: {
        ...query.select,
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
