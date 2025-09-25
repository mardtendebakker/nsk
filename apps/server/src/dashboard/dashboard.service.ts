import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { DashboardTotalDto } from './dto/dashboard-total.dto';
import { DateRange } from './types/DateRange';

@Injectable()
export class DashboardService {
  constructor(
    protected readonly repository: DashboardRepository,
  ) { }

  async total(query: DashboardTotalDto, email?: string) {
    const range = this.buildMysqlDateRange(query);
    const total = await this.repository.total(range, email);

    return {
      totalSpent: total.spent,
      totalEarned: total.earned,
      totalOrders: total.orders,
      totalSuppliers: total.suppliers,
      totalCustomers: total.customers,
    };
  }

  private buildMysqlDateRange({ year, month, toMonth }: DashboardTotalDto): DateRange {
    let startDate: string;
    let endDate: string;

    if (year && month && toMonth) {
      startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(toMonth), 0).getDate(); // 0 gives last day of previous month
      endDate = `${year}-${toMonth}-${String(lastDay).padStart(2, '0')}`;
    } else if (year && month) {
      startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else if (year) {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else {
      return null; // No filtering
    }

    return { startDate, endDate };
  }
}
