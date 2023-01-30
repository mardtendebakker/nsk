import { Injectable } from '@nestjs/common';
import { FindOrderQueryDto } from './dto/find-order-query.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  async getOrders(findOrderDto: FindOrderQueryDto) {
    const orders = await this.repository.getOrders({
      where: findOrderDto,
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
}
