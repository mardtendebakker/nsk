import { Injectable } from '@nestjs/common';
import { FindAcompanyQueryDto } from '../common/dto/find-acompany-query.dto';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async getCustomers(queryOptions: FindAcompanyQueryDto) {
    const customers = await this.repository.getCustomers({
      ...queryOptions,
      select: {
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
    });
    return customers;
  }
}
