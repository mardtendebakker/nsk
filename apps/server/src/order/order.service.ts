import { FindOrderQueryDto } from './dto/find-order-query.dto';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDiscrimination } from './types/order-discrimination.enum';
import { Prisma } from '@prisma/client';

export class OrderService {
  constructor(
    protected readonly repository: OrderRepository,
    protected type: OrderDiscrimination
  ) {}

  async getOrders(order_nr: string) {
    const orders = await this.repository.getOrders({
      where: {
        order_nr
      },
      select: {
        id: true,
        order_nr: true,
        order_date: true,
        acompany_aorder_supplier_idToacompany: {
          select: {
            name: true,
          },
        },
      },
    });
    return orders.map(order => {
      const {acompany_aorder_supplier_idToacompany, ...rest} = order;
      return {
        ...rest,
        company_name: acompany_aorder_supplier_idToacompany?.name || '',
      }
    })
  }

  findAll(queryOptions: FindOrderQueryDto) {
    const companySelect: Prisma.acompanyArgs = {
      select: {
        name: true,
        other_acompany: {
          select: {
            name: true
          }
        }
      }
    }
    let select: Prisma.aorderSelect = {
      id: true,
      order_nr: true,
      order_date: true,
      order_status: {
        select: {
          name: true
        }
      }
    }
    if (this.type === OrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: companySelect
      }
    } else if (this.type === OrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: companySelect
      }
    }

    return this.repository.findAll({
      ...queryOptions,
      where: {
        ...queryOptions.where,
        discr: this.type
      },
      select
    });
  }

  async create(comapny: CreateOrderDto) {
    return this.repository.create({
      ...comapny,
      discr: this.type
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({ id });
  }

  async update(id: number, comapny: UpdateOrderDto) {
    return this.repository.update({
      data: comapny,
      where: { id }
    });
  }
}
