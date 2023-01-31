import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { FindAcompanyQueryDto } from '../common/dto/find-acompany-query.dto';
import { FindAcompanyResponeDto } from '../common/dto/find-customer-response.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindAcompanyResponeDto})
  findAll(@Query() query: FindAcompanyQueryDto) {
    return this.customerService.getCustomers(query);
  }
}
