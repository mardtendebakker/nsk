import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DateRange } from './types/DateRange';

@Injectable()
export class DashboardRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async total(range?: DateRange, email?: string) {
    const startSql = Prisma.sql`
      WITH filtered_orders AS (
        SELECT DISTINCT ao.id
        FROM aorder ao
      `;

    const emailCond = email ? Prisma.sql`
      LEFT JOIN contact supp ON supp.id = ao.supplier_id
      LEFT JOIN company supp_comp ON supp.company_id = supp_comp.id
      LEFT JOIN company supp_partner ON supp_comp.partner_id = supp_partner.id
      LEFT JOIN contact supp_company_contact ON supp_company_contact.company_id = supp_comp.id
      LEFT JOIN contact supp_partner_contact ON supp_partner_contact.company_id = supp_partner.id
      LEFT JOIN contact cust ON cust.id = ao.customer_id
      LEFT JOIN company cust_comp ON cust.company_id = cust_comp.id
      LEFT JOIN company cust_partner ON cust_comp.partner_id = cust_partner.id
      LEFT JOIN contact cust_company_contact ON cust_company_contact.company_id = cust_comp.id
      LEFT JOIN contact cust_partner_contact ON cust_partner_contact.company_id = cust_partner.id
      WHERE
        (
          cust_company_contact.email = ${email} OR
          cust_partner_contact.email = ${email} OR
          supp_company_contact.email = ${email} OR
          supp_partner_contact.email = ${email}
        )
      ` : Prisma.sql``;

    const dateCond = range ? Prisma.sql`
      ${email ? Prisma.raw('AND') : Prisma.raw('WHERE')} ao.order_date BETWEEN ${range.startDate} AND ${range.endDate}
    ` : Prisma.sql``;

    const endSql = Prisma.sql`
      )
      SELECT
        COALESCE(SUM(CASE WHEN ao.discr = 'p' THEN COALESCE(po.quantity,1) * COALESCE(po.price,0) ELSE 0 END), 0) AS spent,
        COALESCE(SUM(CASE WHEN ao.discr = 's' THEN COALESCE(po.quantity,1) * COALESCE(po.price,0) ELSE 0 END), 0) AS earned,
        (SELECT COUNT(*) FROM filtered_orders) AS orders,
        (SELECT COUNT(DISTINCT supplier_id) FROM aorder WHERE id IN (SELECT id FROM filtered_orders)) AS suppliers,
        (SELECT COUNT(DISTINCT customer_id) FROM aorder WHERE id IN (SELECT id FROM filtered_orders)) AS customers
      FROM filtered_orders fo
      JOIN aorder ao ON ao.id = fo.id
      JOIN product_order po ON po.order_id = ao.id;
    `;
    const result = await this.prisma.$queryRaw<{
      spent: number;
      earned: number;
      orders: number;
      suppliers: number;
      customers: number;
    }[]>(Prisma.sql`${startSql}${emailCond}${dateCond}${endSql}`);

    return result[0];
  }
}
