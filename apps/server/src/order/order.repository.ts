import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Sql } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { GroupBy } from './types/group-by.enum';
import { AnalyticsResultDto, GroupByDateResult } from './dto/analytics-result.dto';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';

@Injectable()
export class OrderRepository extends AOrderRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly configService: ConfigService,
  ) {
    super(prisma, configService);
  }

  async analytics(groupBy: GroupBy, email?: string): Promise<AnalyticsResultDto> {
    const MONTH_QUERY_INIT = Prisma.sql`
      WITH last_12_months AS (
        SELECT
          YEAR(DATE_SUB(CURRENT_DATE, INTERVAL n MONTH)) AS year,
          MONTH(DATE_SUB(CURRENT_DATE, INTERVAL n MONTH)) AS month
        FROM
          (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
          UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
          UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11) AS nums
        )
        SELECT
          m.year,
          m.month,
          COUNT(o.id) AS count
        FROM
          last_12_months m
        LEFT JOIN
          aorder o
            ON YEAR(o.order_date) = m.year AND MONTH(o.order_date) = m.month
            AND o.order_date > CURRENT_DATE - INTERVAL 12 MONTH
    `;
    const DAY_QUERY_INIT = Prisma.sql`
      WITH last_30_days AS (
        SELECT
          DATE(DATE_SUB(CURRENT_DATE, INTERVAL n DAY)) AS day_date,
          YEAR(DATE_SUB(CURRENT_DATE, INTERVAL n DAY)) AS year,
          MONTH(DATE_SUB(CURRENT_DATE, INTERVAL n DAY)) AS month,
          DAY(DATE_SUB(CURRENT_DATE, INTERVAL n DAY)) AS day
        FROM
          (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
          UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
          UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
          UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
          UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29) nums
        )
        SELECT
          d.year,
          d.month,
          d.day,
          COUNT(o.id) AS count
        FROM
          last_30_days d
        LEFT JOIN
          aorder o
            ON DATE(o.order_date) = d.day_date
    `;
    const PURCHASE_COND = Prisma.sql`AND o.discr = ${AOrderDiscrimination.PURCHASE}`;
    const SALE_COND = Prisma.sql`AND o.discr = ${AOrderDiscrimination.SALE}
                      AND NOT EXISTS (SELECT 1 FROM repair r WHERE r.order_id = o.id)`;
    const REPAIR_COND = Prisma.sql`AND o.discr = ${AOrderDiscrimination.SALE}
                        AND EXISTS (SELECT 1 FROM repair r WHERE r.order_id = o.id)`;
    const MONTH_GROUP_SORT = Prisma.sql`GROUP BY year, month ORDER BY year, month;`;
    const DAY_GROUP_SORT = Prisma.sql`GROUP BY year, month, day ORDER BY year, month, day;`;

    let purchaseQuery: Sql;
    let saleQuery: Sql;
    let repairQuery: Sql;

    const EMAIL_COND = email
      ? Prisma.sql`
        AND (
          o.customer_id IN (
            SELECT c.id
            FROM contact c
            LEFT JOIN company main ON c.company_id = main.id
            LEFT JOIN company partner ON main.partner_id = partner.id
            WHERE 
              c.email = ${email}
              OR main.id = (
                SELECT company_id
                FROM contact
                WHERE email = ${email}
              )
              OR partner.id = (
                SELECT partner_id
                FROM company
                WHERE id = (
                  SELECT company_id
                  FROM contact
                  WHERE email = ${email}
                )
              )
          )
          OR o.supplier_id IN (
            SELECT c.id
            FROM contact c
            LEFT JOIN company main ON c.company_id = main.id
            LEFT JOIN company partner ON main.partner_id = partner.id
            WHERE 
              c.email = ${email}
              OR main.id = (
                SELECT company_id
                FROM contact
                WHERE email = ${email}
              )
              OR partner.id = (
                SELECT partner_id
                FROM company
                WHERE id = (
                  SELECT company_id
                  FROM contact
                  WHERE email = ${email}
                )
              )
          )
        )
      `
      : Prisma.sql``;

    purchaseQuery = Prisma.sql`
      ${MONTH_QUERY_INIT}
      ${PURCHASE_COND}
      ${EMAIL_COND}
      ${MONTH_GROUP_SORT}
    `;
    saleQuery = Prisma.sql`
      ${MONTH_QUERY_INIT}
      ${SALE_COND}
      ${EMAIL_COND}
      ${MONTH_GROUP_SORT}
    `;
    repairQuery = Prisma.sql`
      ${MONTH_QUERY_INIT}
      ${REPAIR_COND}
      ${EMAIL_COND}
      ${MONTH_GROUP_SORT}
    `;
    if (groupBy === GroupBy.DAYS) {
      purchaseQuery = Prisma.sql`
        ${DAY_QUERY_INIT}
        ${PURCHASE_COND}
        ${EMAIL_COND}
        ${DAY_GROUP_SORT}
      `;
      saleQuery = Prisma.sql`
        ${DAY_QUERY_INIT}
        ${SALE_COND}
        ${EMAIL_COND}
        ${DAY_GROUP_SORT}
      `;
      repairQuery = Prisma.sql`
        ${DAY_QUERY_INIT}
        ${REPAIR_COND}
        ${EMAIL_COND}
        ${DAY_GROUP_SORT}
      `;
    }

    const submission = await this.prisma.$transaction([
      this.prisma.$queryRaw(purchaseQuery),
      this.prisma.$queryRaw(saleQuery),
      this.prisma.$queryRaw(repairQuery),
    ]);

    const result = {
      purchase: submission[0] as GroupByDateResult[],
      sale: submission[1] as GroupByDateResult[],
      repair: submission[2] as GroupByDateResult[],
    };

    return result;
  }
}
