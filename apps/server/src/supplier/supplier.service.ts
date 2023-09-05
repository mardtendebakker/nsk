import { Inject, Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { SupplierRepository } from './supplier.repository';
import { CompanyDiscrimination } from '../company/types/company-discrimination.enum';

@Injectable()
export class SupplierService extends CompanyService {
  constructor(
    protected readonly repository: SupplierRepository,
    @Inject('TYPE') protected readonly type: CompanyDiscrimination
  ) {
    super(repository, type);
  }
}
