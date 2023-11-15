import { Inject, Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { CustomerRepository } from './customer.repository';
import { ContactDiscrimination } from '../contact/types/contact-discrimination.enum';

@Injectable()
export class CustomerService extends ContactService {
  constructor(
    protected readonly repository: CustomerRepository,
    @Inject('TYPE') protected readonly type: ContactDiscrimination
  ) {
    super(repository, type);
  }
}
