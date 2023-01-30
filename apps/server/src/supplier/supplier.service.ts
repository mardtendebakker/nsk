import { Injectable } from '@nestjs/common';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService {
  constructor(private readonly repository: SupplierRepository) {}

  async getSuppliers() {
    const suppliers = await this.repository.getSuppliers({
      select: {
        id: true,
        name: true,
        representative: true,
        email: true,
        partner_id: true
      },
    });
    return suppliers;
  }
}
