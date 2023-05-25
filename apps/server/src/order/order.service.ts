import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { GroupBy } from './types/group-by.enum';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(protected readonly repository: OrderRepository) {}

  async analytics(groupBy: GroupBy): Promise<AnalyticsResultDto> {
    return this.repository.analytics(groupBy);
  }

  async getAllProductsById(id: number) {
    const productSelect: Prisma.productSelect = {
      sku: true,
      name: true,
      type_id: true,
      location_id: true,
      status_id: true,
      price: true,
      description: true,
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      product: {
        select: productSelect
      }
    };

    const select: Prisma.aorderSelect = {
      product_order: {
        select: productOrderSelect
      }
    };

    const where: Prisma.aorderWhereUniqueInput = {
      id
    };

    const result = await this.repository.findOne({
      where,
      select
    }) as Prisma.aorderGetPayload<Record<'select', typeof select>>;

    return result.product_order.map(
      porder => (porder as Prisma.product_orderGetPayload<Record<'select', typeof productOrderSelect>>)
        .product
    );
  }
}
