import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { FindAcompanyQueryDto } from '../company/dto/find-company-query.dto';
import { FindCompaniesResponeDto } from '../company/dto/find-company-response.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindCompaniesResponeDto})
  findAll(@Query() query: FindAcompanyQueryDto) {
    return this.customerService.getCompanies(query);
  }
}
