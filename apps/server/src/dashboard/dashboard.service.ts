import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';


@Injectable()
export class DashboardService {
  constructor(
    protected readonly repository: DashboardRepository,
  ) { }

  async totalCount() {
    const totalCustomers = await this.repository.companyCount({
      where: {
        is_customer: true,
      }
    });
    const totalSuppliers = await this.repository.companyCount({
      where: {
        is_supplier: true,
      }
    });

    return {
      totalCustomers,
      totalSuppliers
    };
  }
}
