import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AOrder } from './dto/update-many-aorder.dto';
import { GroupBy } from './types/group-by.enum';
import { Sql } from '@prisma/client/runtime';
import { GroupByDateResult, ProductAnalyticsResultDto } from './dto/product-analytics-result.dto';

export class AOrderRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async getAOrders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.aorderWhereUniqueInput;
    where?: Prisma.aorderWhereInput;
    select?: Prisma.aorderSelect;
    orderBy?: Prisma.aorderOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, select, orderBy } = params;
    return this.prisma.aorder.findMany({ skip, take, cursor, where, select, orderBy });
  }

  async findAll(params: Prisma.aorderFindManyArgs) {
    const { skip, cursor, where, select, orderBy } = params;
    const take = params.take ? params.take : 20;
    const submission = await this.prisma.$transaction([
      this.prisma.aorder.count({ where }),
      this.prisma.aorder.findMany({ skip, take, cursor, where, select, orderBy })
    ]);

    return {
      count: submission[0] ?? 0,
      data: submission[1],
    };
  }

  findBy(params: Prisma.aorderFindManyArgs) {
    const { where, select, orderBy } = params;
    return this.prisma.aorder.findMany({ where, select, orderBy })
  }

  create(data: Prisma.aorderCreateInput) {
    return this.prisma.aorder.create({
      data
    });
  }

  findOne(where: Prisma.aorderWhereUniqueInput) {
    return this.prisma.aorder.findUnique({
      where,
    });
  }

  update(params: {
    where: Prisma.aorderWhereUniqueInput;
    data: Prisma.aorderUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.aorder.update({
      data,
      where,
    });
  }

  updateMany(params: {
    where: Prisma.aorderWhereInput;
    data: AOrder;
  }) {
    const { where, data } = params;
    return this.prisma.aorder.updateMany({
      data,
      where,
    });
  }

  deleteMany(ids: number[]) {
    return this.prisma.aorder.deleteMany({ where: { id: { in: ids } } })
  }

  async productAnalytics(discr: string, groupBy: GroupBy): Promise<ProductAnalyticsResultDto> {
    const REPAIR_STATUS_ID = 45;
    const LAST_THIRTY_DAYS = '30';
    const LAST_TWELVE_MONTH = '12';
    
    let nonRepairQuery, repairQuery: Sql;
    nonRepairQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM nexxus_application.aorder o
      WHERE o.discr = ${discr}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id <> ${REPAIR_STATUS_ID}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    repairQuery = Prisma.sql`
      SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, count(1) count
      FROM nexxus_application.aorder o
      WHERE o.discr = ${discr}
      AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_TWELVE_MONTH} MONTH
      AND o.status_id = ${REPAIR_STATUS_ID}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    if (groupBy === GroupBy.DAYS) {
      nonRepairQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM nexxus_application.aorder o
        WHERE o.discr = ${discr}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id <> ${REPAIR_STATUS_ID}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
      repairQuery = Prisma.sql`
        SELECT YEAR(o.order_date) year, MONTH(o.order_date) month, DAY(o.order_date) day, count(1) count
        FROM nexxus_application.aorder o
        WHERE o.discr = ${discr}
        AND o.order_date > CURRENT_DATE - INTERVAL ${LAST_THIRTY_DAYS} DAY
        AND o.status_id = ${REPAIR_STATUS_ID}
        GROUP BY year, month, day
        ORDER BY year, month, day;
      `;
    }

    const submission = await this.prisma.$transaction([
      this.prisma.$queryRaw(nonRepairQuery),
      this.prisma.$queryRaw(repairQuery),
    ]);

    const result = {
      nonrepair: submission[0] as GroupByDateResult[],
      repair: submission[1] as GroupByDateResult[],
    };

    return result;
  }
}
