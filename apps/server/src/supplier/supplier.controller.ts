import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAcompanyQueryDto } from '../company/dto/find-company-query.dto';
import { FindCompaniesResponeDto } from '../company/dto/find-company-response.dto';
import { SupplierService } from './supplier.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  @Get('')
  @ApiResponse({isArray: true, type: FindCompaniesResponeDto})
  findAll(@Query() query: FindAcompanyQueryDto) {
    return this.supplierService.getCompanies(query);
  }
}
