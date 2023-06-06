import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyController } from '../company/company.controller';
import { SupplierService } from './supplier.service';
import { FindCompaniesResponeDto } from '../company/dto/find-company-response.dto';
import { FindManyDto } from '../company/dto/find-many.dto';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController extends CompanyController {
  constructor(protected readonly supplierService: SupplierService) {
    super(supplierService);
  }
  
  @Get('')
  @ApiResponse({type: FindCompaniesResponeDto})
  findAll(@Query() query: FindManyDto) {
    return this.companyService.findAll(query);
  }
}
