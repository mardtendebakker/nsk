import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FindManyDto } from '../common/dto/find-many.dto';

export class CompanyService {
  constructor(
    protected readonly repository: CompanyRepository,
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
    });
  }

  async create(comapny: CreateCompanyDto) {
    return this.repository.create({
      ...comapny
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
