import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDiscrimination } from './types/order-discrimination.enum';
import { Prisma } from '@prisma/client';
import { FindManyDto } from './dto/find-many.dto';
import { UpdateManyOrderDto } from './dto/update-many-order.dto';
import { OrderProcess } from './order.process';

export class OrderService {
  constructor(
    protected readonly repository: OrderRepository,
    protected readonly type: OrderDiscrimination
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
      };
    });
  }

  async findAll(query: FindManyDto) {
    const productSelect: Prisma.productSelect = {
      sku: true,
      name: true,
      product_type: {
        select: {
          name: true
        }
      },
    };

    const serviceSelect: Prisma.aserviceSelect = {
      status: true,
      price: true
    };

    const productOrderSelect: Prisma.product_orderSelect = {
      quantity:true,
      price: true,
      product: {
        select: productSelect,
      },
      aservice: {
        select: serviceSelect,
      }
    };
    
    const companySelect: Prisma.acompanySelect = {
      name: true,
      kvk_nr: true,
      representative: true,
      email: true,
      phone: true,
      street: true,
      street_extra: true,
      city: true,
      zip: true,
      state: true,
      country: true,
      acompany: {
        select: {
          id: true,
          name: true,
        }
      }
    };
    
    let select: Prisma.aorderSelect = {
      id: true,
      order_nr: true,
      order_date: true,
      remarks: true,
      delivery_type: true,
      delivery_date: true,
      delivery_instructions: true,
      transport: true,
      discount: true,
      is_gift: true,
      order_status: {
        select: {
          id: true,
          name: true,
          color: true,
        }
      },
      product_order: {
        select: productOrderSelect,
      },
    };

    if (this.type === OrderDiscrimination.SALE) {
      select = {
        ...select,
        acompany_aorder_customer_idToacompany: {
          select: companySelect,
        },
      };
    } else if (this.type === OrderDiscrimination.PURCHASE) {
      select = {
        ...select,
        acompany_aorder_supplier_idToacompany: {
          select: companySelect,
        },
      };
    }

    const where = {
        ...query.where,
        discr: this.type,
        ...(query.search && { order_nr: { contains: query.search }}),
        ...(query.status && { status_id: { equals: query.status }})
    };

    if(query.partner !== undefined) {
      if(this.type === OrderDiscrimination.PURCHASE) {
        where.acompany_aorder_customer_idToacompany = {
          partner_id: query.partner,
        };
      } else if (this.type === OrderDiscrimination.SALE) {
        where.acompany_aorder_supplier_idToacompany = {
          partner_id: query.partner,
        };
      }
    }

    if(query.createdBy !== undefined) {
      where.OR = [
        {
          acompany_aorder_customer_idToacompany : {
            id: query.createdBy,
          },
        },
        {
          acompany_aorder_supplier_idToacompany : {
            id: query.createdBy,
          },
        },
      ];
    }

    const result = await this.repository.findAll({
      ...query,
      where,
      select,
      orderBy: query.orderBy,
    });

    const data = await Promise.all(result.data.map(async order => {
      const orderProcess = new OrderProcess(order);
      return orderProcess.run();
    }));

    return {
      count: result.count,
      data: data,
    };
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

  async updateMany(updateManyOrderDto: UpdateManyOrderDto) {
    return this.repository.updateMany({
      data: updateManyOrderDto.order,
      where: { 
        id: {in: updateManyOrderDto.ids}
       }
    });
  }

  async deleteMany(ids: number[]) {
    return this.repository.deleteMany(ids);
  }
}
