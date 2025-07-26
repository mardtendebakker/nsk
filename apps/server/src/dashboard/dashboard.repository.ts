import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  companyCount(params: Prisma.companyFindManyArgs) {
    const { where } = params;

    return this.prisma.company.count({ where });
  }

  orderCount(params: Prisma.aorderFindManyArgs) {
    const { where } = params;

    return this.prisma.aorder.count({ where });
  }

  async finances(email?: string) {
    const commonSql = Prisma.sql`
      SELECT
          COALESCE(SUM(
              CASE WHEN ao.discr = 'p' THEN
                  (CASE WHEN po.quantity IS NULL THEN 1 ELSE po.quantity END) * COALESCE(po.price, 0)
              ELSE 0 END
          ), 0) AS total_spent,

          COALESCE(SUM(
              CASE WHEN ao.discr = 's' THEN
                  (CASE WHEN po.quantity IS NULL THEN 1 ELSE po.quantity END) * COALESCE(po.price, 0)
              ELSE 0 END
          ), 0) AS total_earned

      FROM product_order po
      JOIN aorder ao ON ao.id = po.order_id
    `;

    const emailCond = email ? Prisma.sql`
      LEFT JOIN contact cust ON cust.id = ao.customer_id
      LEFT JOIN company cust_comp ON cust.company_id = cust_comp.id
      LEFT JOIN company cust_partner ON cust_comp.partner_id = cust_partner.id
      LEFT JOIN contact cust_company_contact ON cust_company_contact.company_id = cust_comp.id
      LEFT JOIN contact cust_partner_contact ON cust_partner_contact.company_id = cust_partner.id

      LEFT JOIN contact supp ON supp.id = ao.supplier_id
      LEFT JOIN company supp_comp ON supp.company_id = supp_comp.id
      LEFT JOIN company supp_partner ON supp_comp.partner_id = supp_partner.id
      LEFT JOIN contact supp_company_contact ON supp_company_contact.company_id = supp_comp.id
      LEFT JOIN contact supp_partner_contact ON supp_partner_contact.company_id = supp_partner.id
      
      WHERE
        (
          cust_company_contact.email = ${email} OR
          cust_partner_contact.email = ${email} OR
          supp_company_contact.email = ${email} OR
          supp_partner_contact.email = ${email}
        )
      ` : Prisma.sql``;
    const result = await this.prisma.$queryRaw<{ total_spent: number; total_earned: number }[]>(Prisma.sql`${commonSql}${emailCond}`);

    return result[0];
  }
}
