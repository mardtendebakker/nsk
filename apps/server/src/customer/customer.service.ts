import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService extends CompanyService {
  constructor(protected readonly repository: CustomerRepository) {
    super(repository);
  }
}
