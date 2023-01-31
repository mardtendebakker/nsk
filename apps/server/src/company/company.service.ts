import { FindAcompanyQueryDto } from './dto/find-company-query.dto';
import { CompanyRepository } from './company.repository';

export class CompanyService {
  constructor(protected readonly repository: CompanyRepository) {}

  async getCompanies(queryOptions: FindAcompanyQueryDto) {
    const companies = await this.repository.getCompanies({
      ...queryOptions,
      select: {
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
    });
    return companies;
  }
}
