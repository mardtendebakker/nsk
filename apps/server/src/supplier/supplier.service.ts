import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { SupplierRepository } from './supplier.repository';
import { CompanyDiscrimination } from '../company/types/comapny-discrimination.enum';

@Injectable()
export class SupplierService extends CompanyService {
  constructor(protected readonly repository: SupplierRepository) {
    super(repository, CompanyDiscrimination.SUPLLIER);
  }
}
