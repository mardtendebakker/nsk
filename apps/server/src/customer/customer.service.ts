import { Injectable } from '@nestjs/common';
import { CompanyDiscrimination } from '../company/types/comapny-discrimination.enum';
import { CompanyService } from '../company/company.service';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService extends CompanyService {
  constructor(protected readonly repository: CustomerRepository) {
    super(repository, CompanyDiscrimination.CUSTOMER);
  }
}
