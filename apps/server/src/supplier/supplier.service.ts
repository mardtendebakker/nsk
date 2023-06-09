import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService extends CompanyService {
  constructor(protected readonly repository: SupplierRepository) {
    super(repository);
  }
}
