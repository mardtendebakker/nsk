import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService extends ContactService {
  constructor(
    protected readonly repository: CustomerRepository,
  ) {
    super(repository);
  }
}
