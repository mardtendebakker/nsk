import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(
    protected readonly repository: DashboardRepository,
  ) { }

  async totalCount(email?: string) {
    const totalCustomers = await this.repository.companyCount({
      where: {
        is_customer: true,
        ...(email && {
          OR: [
            { companyContacts: { some: { email } } },
            { company: { companyContacts: { some: { email } } } },
          ],
        }),
      },
    });
    const totalSuppliers = await this.repository.companyCount({
      where: {
        is_supplier: true,
        ...(email && {
          OR: [
            { companyContacts: { some: { email } } },
            { company: { companyContacts: { some: { email } } } },
          ],
        }),
      },
    });

    const totalOrders = await this.repository.orderCount({
      where: this.getOrderWhereInput(email),
    });

    return {
      totalCustomers,
      totalSuppliers,
      totalOrders,
    };
  }

  private getContactWhereInput(email?: string): Prisma.contactWhereInput {
    return {
      ...(email && {
        company_contact_company_idTocompany: {
          OR: [
            { companyContacts: { some: { email } } },
            { company: { companyContacts: { some: { email } } } },
          ],
        },
      }),
    };
  }

  private getOrderWhereInput(email?: string): Prisma.aorderWhereInput {
    return {
      ...(email && {
        OR: [
          {
            contact_aorder_supplier_idTocontact: this
              .getContactWhereInput(email),
          },
          {
            contact_aorder_customer_idTocontact: this
              .getContactWhereInput(email),
          },
        ],
      }),
    };
  }
}
