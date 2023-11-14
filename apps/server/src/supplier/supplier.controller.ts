import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactController } from '../contact/contact.controller';
import { SupplierService } from './supplier.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController extends ContactController {
  constructor(protected readonly supplierService: SupplierService) {
    super(supplierService);
  }
}
