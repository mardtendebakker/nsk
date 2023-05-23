import { Injectable } from '@nestjs/common';
import { AOrderRepository } from '../aorder/aorder.repository';
import { PrismaService } from '../prisma/prisma.service';
import { GroupBy } from './types/group-by.enum';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { Prisma } from '@prisma/client';
import { Sql } from '@prisma/client/runtime';
import { GroupByDateResult } from './dto/analytics-result.dto';
import { AOrderDiscrimination } from '../aorder/types/aorder-discrimination.enum';

@Injectable()
export class OrderRepository extends AOrderRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async analytics(groupBy: GroupBy): Promise<AnalyticsResultDto> {
    const REPAIR_STATUS_ID = 45;
    const LAST_THIRTY_DAYS = '30';
    const LAST_TWELVE_MONTH = '12';
    
    let repairQuery, saleQuery, purchaseQuery: Sql;
    saleQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM nexxus_application.aorder o
      WHERE o.discr = ${AOrderDiscrimination.SALE}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id <> ${REPAIR_STATUS_ID}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    purchaseQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM nexxus_application.aorder o
      WHERE o.discr = ${AOrderDiscrimination.PURCHASE}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id <> ${REPAIR_STATUS_ID}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    repairQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM nexxus_application.aorder o
      WHERE o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id = ${REPAIR_STATUS_ID}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    if (groupBy === GroupBy.DAYS) {
      saleQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM nexxus_application.aorder o
        WHERE o.discr = ${AOrderDiscrimination.SALE}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id <> ${REPAIR_STATUS_ID}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
      purchaseQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM nexxus_application.aorder o
        WHERE o.discr = ${AOrderDiscrimination.PURCHASE}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id <> ${REPAIR_STATUS_ID}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
      repairQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM nexxus_application.aorder o
        WHERE o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id = ${REPAIR_STATUS_ID}
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
