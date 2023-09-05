import { Inject, Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CustomerRepository } from './customer.repository';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';

@Injectable()
export class CustomerService extends CompanyService {
  constructor(
    protected readonly repository: CustomerRepository,
    @Inject('TYPE') protected readonly type: CompanyDiscrimination
  ) {
    super(repository, type);
  }
}
