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
    const REPAIR_STATUS_ID = 45;
    const LAST_THIRTY_DAYS = '30';
    const LAST_TWELVE_MONTH = '12';

    let repairQuery;
    let saleQuery;
    let purchaseQuery: Sql;

    const emailCondition = email
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

    saleQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM aorder o
      WHERE o.discr = ${AOrderDiscrimination.SALE}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id <> ${REPAIR_STATUS_ID}
      ${emailCondition}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    purchaseQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM aorder o
      WHERE o.discr = ${AOrderDiscrimination.PURCHASE}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id <> ${REPAIR_STATUS_ID}
      ${emailCondition}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    repairQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM aorder o
      WHERE o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id = ${REPAIR_STATUS_ID}
      ${emailCondition}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    if (groupBy === GroupBy.DAYS) {
      saleQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM aorder o
        WHERE o.discr = ${AOrderDiscrimination.SALE}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id <> ${REPAIR_STATUS_ID}
        ${emailCondition}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
      purchaseQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM aorder o
        WHERE o.discr = ${AOrderDiscrimination.PURCHASE}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id <> ${REPAIR_STATUS_ID}
        ${emailCondition}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
      repairQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM aorder o
        WHERE o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id = ${REPAIR_STATUS_ID}
        ${emailCondition}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
    }

    const submission = await this.prisma.$transaction([
      this.prisma.$queryRaw(saleQuery),
      this.prisma.$queryRaw(purchaseQuery),
      this.prisma.$queryRaw(repairQuery),
    ]);

    const result = {
      sale: submission[0] as GroupByDateResult[],
      purchase: submission[1] as GroupByDateResult[],
      repair: submission[2] as GroupByDateResult[],
    };

    return result;
  }
}
