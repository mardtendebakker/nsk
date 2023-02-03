import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyController } from '../company/company.controller';
import { SupplierService } from './supplier.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController extends CompanyController {
  constructor(protected readonly supplierService: SupplierService) {
    super(supplierService);
  }
}
