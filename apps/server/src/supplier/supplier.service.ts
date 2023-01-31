import { Injectable } from '@nestjs/common';
import { FindAcompanyQueryDto } from '../common/dto/find-acompany-query.dto';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService {
  constructor(private readonly repository: SupplierRepository) {}

  async getSuppliers(queryOptions: FindAcompanyQueryDto) {
    const suppliers = await this.repository.getSuppliers({
      ...queryOptions,
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
