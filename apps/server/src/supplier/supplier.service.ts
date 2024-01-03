import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService extends ContactService {
  constructor(
    protected readonly repository: SupplierRepository,
  ) {
    super(repository);
  }
}
