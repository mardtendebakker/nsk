import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { ContactController } from '../contact/contact.controller';

@ApiTags('customers')
@Controller('customers')
export class CustomerController extends ContactController {
  constructor(protected readonly customerService: CustomerService) {
    super(customerService);
  }
}
