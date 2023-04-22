import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CompanyController } from '../company/company.controller';
import { FindCompaniesResponeDto } from '../company/dto/find-company-response.dto';
import { FindManyDto } from '../company/dto/find-many.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController extends CompanyController {
  constructor(protected readonly customerService: CustomerService) {
    super(customerService);
  }
  
  @Get('')
  @ApiResponse({isArray: true, type: FindCompaniesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.companyService.findAll(query);
  }
}
