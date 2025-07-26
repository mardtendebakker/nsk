import { ApiProperty } from '@nestjs/swagger';

export class DashboardTotal {
  @ApiProperty()
    totalSpent: number;

  @ApiProperty()
    totalEarned: number;

  @ApiProperty()
    totalOrders: number;

  @ApiProperty()
    totalSuppliers: number;

  @ApiProperty()
    totalCustomers: number;
}
