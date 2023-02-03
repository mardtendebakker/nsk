import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CompanyController } from '../company/company.controller';

@ApiTags('customers')
@Controller('customers')
export class CustomerController extends CompanyController {
  constructor(protected readonly customerService: CustomerService) {
    super(customerService);
  }
}
