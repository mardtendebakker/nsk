import { Injectable } from '@nestjs/common';
import { FindAcompanyQueryDto } from '../company/dto/find-company-query.dto';
import { CompanyService } from '../company/company.service';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService extends CompanyService {
  constructor(protected readonly repository: SupplierRepository) {
    super(repository);
  }
}
